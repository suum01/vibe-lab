const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
  Notification,
  powerMonitor,
  shell,
} = require("electron");
const fs = require("node:fs"),
  path = require("node:path");
const { Timer } = require("./timer.cjs");
let win,
  tray,
  timer,
  interval,
  quitting = false;
app.setAppUserModelId("com.suum01.sequence-timer");
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on("second-instance", () => {
    win?.show();
    win?.focus();
  });
  app.whenReady().then(() => {
    const storage = path.join(app.getPath("userData"), "tasks.json");
    let tasks = [];
    try {
      tasks = JSON.parse(fs.readFileSync(storage, "utf8"));
      new Timer(tasks);
    } catch {
      tasks = [];
    }
    timer = new Timer(tasks);
    win = new BrowserWindow({
      width: 1060,
      height: 790,
      minWidth: 780,
      minHeight: 640,
      backgroundColor: "#f5f4ef",
      webPreferences: {
        preload: path.join(__dirname, "preload.cjs"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });
    win.setMenuBarVisibility(false);
    win.loadFile("index.html");
    win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    win.webContents.on("will-navigate", (e) => e.preventDefault());
    // A generated PNG avoids platform differences in SVG tray support.
    const size = 32,
      pixels = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const ring = Math.abs(Math.hypot(x - 15.5, y - 15.5) - 11) < 1.5;
        const hand =
          (Math.abs(x - 16) < 1 && y >= 8 && y <= 17) ||
          (y >= 16 && y <= 21 && Math.abs(x - (y - 1)) < 1.5);
        const v = ring || hand;
        pixels[i] = v ? 250 : 50;
        pixels[i + 1] = v ? 250 : 100;
        pixels[i + 2] = v ? 240 : 81;
        pixels[i + 3] = 255;
      }
    tray = new Tray(
      nativeImage.createFromBitmap(pixels, { width: size, height: size }),
    );
    tray.setToolTip("차례차례 타이머");
    tray.setContextMenu(
      Menu.buildFromTemplate([
        { label: "타이머 열기", click: () => win.show() },
        {
          label: "완전히 종료",
          click: () => {
            quitting = true;
            app.quit();
          },
        },
      ]),
    );
    tray.on("double-click", () => win.show());
    win.on("close", (e) => {
      if (!quitting) {
        e.preventDefault();
        win.hide();
      }
    });
    const notify = (title, body) => {
      // Windows system sound; headless Linux display servers cannot ring XBell.
      if (process.platform === "win32") shell.beep();
      if (Notification.isSupported()) {
        const n = new Notification({ title, body });
        n.on("click", () => win.show());
        n.show();
      }
    };
    const update = () => {
      const events = timer.tick();
      if (events.length) {
        const last = events.at(-1);
        notify(
          last.next
            ? `${last.title} 시간 끝!`
            : "모든 할 일의 시간이 끝났어요!",
          last.next
            ? `다음: ${last.next} — 타이머를 시작했어요.`
            : "수고했어요. 잠깐 쉬어 가세요.",
        );
      }
      if (!win.isDestroyed()) win.webContents.send("state", timer.snapshot());
    };
    ipcMain.handle("command", (event, command, payload) => {
      if (
        event.sender !== win.webContents ||
        event.senderFrame !== win.webContents.mainFrame
      )
        return { error: "허용되지 않은 요청입니다." };
      try {
        update();
        switch (command) {
          case "get":
            break;
          case "save": {
            const candidate = new Timer(payload);
            if (["running", "paused"].includes(timer.status))
              throw Error("초기화 후 수정할 수 있어요.");
            fs.writeFileSync(
              storage + ".tmp",
              JSON.stringify(candidate.tasks),
              "utf8",
            );
            fs.renameSync(storage + ".tmp", storage);
            timer.setTasks(candidate.tasks);
            break;
          }
          case "start":
            timer.start();
            break;
          case "pause":
            timer.pause();
            break;
          case "reset":
            timer.reset();
            break;
          case "extend":
            timer.extend();
            break;
          case "skip":
            timer.skip();
            break;
          case "test":
            notify("알림 테스트", "이 알림이 보이고 소리가 들리면 준비 완료!");
            break;
          default:
            throw Error("알 수 없는 요청입니다.");
        }
        update();
        return { state: timer.snapshot() };
      } catch (e) {
        return { error: e.message };
      }
    });
    interval = setInterval(update, 250);
    powerMonitor.on("resume", update);
  });
  app.on("before-quit", () => {
    quitting = true;
    clearInterval(interval);
  });
}
