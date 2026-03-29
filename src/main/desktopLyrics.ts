import { join } from "node:path";

import { BrowserWindow } from "electron";
import { setWindowId } from "./window";

let desktopLyricsWindow: BrowserWindow | null = null;

export default function createDesktopLyricsWindow() {
  desktopLyricsWindow = new BrowserWindow({
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
    desktopLyricsWindow.loadURL(`${GUI_VITE_DEV_SERVER_URL}/desktop-lyrics`);
  } else {
    desktopLyricsWindow.loadFile(join(__dirname, "gui/desktop-lyrics.html"));
  }
  setWindowId(desktopLyricsWindow, "desktop_lyrics");
}

export function getDesktopLyricsWindow() {
  return desktopLyricsWindow;
}
