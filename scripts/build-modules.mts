import { dirname, resolve } from "node:path";
import { readdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

async function runBuildCommand(modulePath: string) {
  return new Promise<{ status: number | null }>((resolve, reject) => {
    const buildProcess = spawn(
      "pnpm",
      ["run", "build"],
      {
        cwd: modulePath,
        stdio: "inherit",
        shell: true,
      }
    );

    buildProcess.on("error", (err) => {
      reject(err);
    });

    buildProcess.on("exit", (code) => {
      resolve({ status: code });
    });
  });
}

async function buildModules() {
  const modulesDir = resolve(dirname(fileURLToPath(import.meta.url)), "../modules");
  const moduleNames = await readdir(modulesDir);
  for (const moduleName of moduleNames) {
    const modulePath = resolve(modulesDir, moduleName);
    console.log(`Building module: ${moduleName}`);
    const result = await runBuildCommand(modulePath);
    if (result.status !== 0) {
      console.error(`Failed to build module: ${moduleName}`);
      process.exit(1);
    }
  }
}

buildModules();
