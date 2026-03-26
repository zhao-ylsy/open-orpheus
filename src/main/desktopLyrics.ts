import { join } from "node:path";

import { BrowserWindow } from "electron";
import { setWindowId } from "./window";

export default function createDesktopLyricsWindow() {
  const wnd = new BrowserWindow({
    width: 1000,
    height: 300,
    skipTaskbar: true,
    transparent: true,
    hasShadow: false,
    frame: false,
    resizable: true,
    show: false,
    webPreferences: {
      partition: "open-orpheus",
    },
  });
  if (GUI_VITE_DEV_SERVER_URL) {
    wnd.loadURL(`${GUI_VITE_DEV_SERVER_URL}/desktop-lyrics`);
  } else {
    wnd.loadFile(join(__dirname, "gui/desktop-lyrics.html"));
  }
  setWindowId(wnd, "desktop_lyrics");
}
