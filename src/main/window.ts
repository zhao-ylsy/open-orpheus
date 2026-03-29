import { app, BrowserWindow, session, shell } from "electron";
import { Menu } from "@open-orpheus/ui";

type WindowProperties = {
  maximumSize?: { x: number; y: number };
  minimumSize?: { x: number; y: number };
  menus: Map<number, Menu>;
  customProps: Record<string, unknown>;
};

const windowProperties = new Map<number, WindowProperties>();

function shouldRespectSizeConstraints(wnd: BrowserWindow) {
  return !wnd.isMaximized() && !wnd.isFullScreen();
}

function enableSizeConstraints(wnd: BrowserWindow) {
  const props = windowProperties.get(wnd.id);
  if (props?.maximumSize) {
    wnd.setMaximumSize(props.maximumSize.x, props.maximumSize.y);
  }
  if (props?.minimumSize) {
    wnd.setMinimumSize(props.minimumSize.x, props.minimumSize.y);
  }
}

function disableSizeConstraints(wnd: BrowserWindow) {
  const props = windowProperties.get(wnd.id);
  if (props?.maximumSize) {
    wnd.setMaximumSize(0, 0);
  }
  if (props?.minimumSize) {
    wnd.setMinimumSize(0, 0);
  }
}

app.on("browser-window-created", (event, wnd) => {
  if (wnd.webContents.session == session.fromPartition("open-orpheus")) {
    return; // Manage internal windows separately.
  }

  windowProperties.set(wnd.id, {
    menus: new Map(),
    customProps: {},
  });
  wnd.on("closed", () => {
    windowProperties.delete(wnd.id);
  });

  wnd.on("maximize", () => {
    disableSizeConstraints(wnd);
  });

  wnd.on("unmaximize", () => {
    enableSizeConstraints(wnd);
  });

  wnd.on("enter-full-screen", () => {
    disableSizeConstraints(wnd);
  });

  wnd.on("leave-full-screen", () => {
    enableSizeConstraints(wnd);
  });

  wnd.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });
});

export function setMaximumSize(wnd: BrowserWindow, x: number, y: number) {
  if (shouldRespectSizeConstraints(wnd)) {
    wnd.setMaximumSize(x, y);
  }
  const props = windowProperties.get(wnd.id);
  if (props) {
    props.maximumSize = { x, y };
  }
}

export function setMinimumSize(wnd: BrowserWindow, x: number, y: number) {
  if (shouldRespectSizeConstraints(wnd)) {
    wnd.setMinimumSize(x, y);
  }
  const props = windowProperties.get(wnd.id);
  if (props) {
    props.minimumSize = { x, y };
  }
}

export function getMenus(wnd: BrowserWindow): Map<number, Menu> {
  const props = windowProperties.get(wnd.id);
  return props ? props.menus : new Map();
}

export function setWindowProp<T>(wnd: BrowserWindow, prop: string, value: T) {
  const customProps = windowProperties.get(wnd.id).customProps;
  customProps[prop] = value;
}

export function getWindowProp<T>(wnd: BrowserWindow, prop: string): T {
  const customProps = windowProperties.get(wnd.id).customProps;
  return customProps[prop] as T;
}
