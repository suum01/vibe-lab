const $ = (id) => document.getElementById(id);
let state = { tasks: [], status: "idle", index: 0, remaining: 0 },
  signature = "";
const busy = () => ["running", "paused"].includes(state.status);
async function command(name, payload) {
  try {
    const r = await window.timerApp.command(name, payload);
    if (r.error) $("message").textContent = r.error;
    else {
      $("message").textContent = "";
      render(r.state);
    }
    return !r.error;
  } catch {
    $("message").textContent = "앱 연결에 실패했습니다. 다시 실행해 주세요.";
    return false;
  }
}
function render(s) {
  state = s;
  const secs = Math.ceil(s.remaining / 1000);
  $("clock").textContent = `${Math.floor(secs / 60)
    .toString()
    .padStart(2, "0")}:${(secs % 60).toString().padStart(2, "0")}`;
  $("current").textContent =
    s.status === "done"
      ? "오늘도 수고했어요!"
      : s.tasks[s.index]?.title || "오늘의 순서를 만들어보세요";
  $("phase").textContent = {
    idle: "READY TO FOCUS",
    running: "FOCUS IN PROGRESS",
    paused: "TAKE A BREATH",
    done: "ALL DONE",
  }[s.status];
  $("next").textContent =
    s.status === "done"
      ? "모든 순서가 끝났어요."
      : s.tasks[s.index + 1]
        ? `다음은 ${s.tasks[s.index + 1].title} · ${s.tasks[s.index + 1].duration / 60000}분`
        : s.tasks.length
          ? "마지막 순서예요. 끝나면 편히 쉬세요."
          : "할 일을 추가하고 시작을 눌러주세요.";
  $("start").textContent = {
    idle: "시작하기",
    running: "일시정지",
    paused: "이어서 하기",
    done: "다시 시작",
  }[s.status];
  $("start").disabled = !s.tasks.length;
  $("extend").disabled = $("skip").disabled = !busy();
  $("total").textContent =
    `${s.tasks.length}개 · ${s.tasks.reduce((a, t) => a + t.duration, 0) / 60000}분`;
  $("add")
    .querySelectorAll("input,button")
    .forEach((el) => (el.disabled = busy()));
  $("empty").hidden = !!s.tasks.length;
  const sig = JSON.stringify([s.tasks, s.index, s.status]);
  if (signature === sig) return;
  signature = sig;
  $("tasks").replaceChildren();
  s.tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.className =
      i < s.index ? "done" : i === s.index && busy() ? "active" : "";
    const n = document.createElement("span");
    n.className = "number";
    n.textContent = String(i + 1).padStart(2, "0");
    const info = document.createElement("div");
    info.className = "taskInfo";
    const title = document.createElement("strong");
    title.textContent = task.title;
    const duration = document.createElement("small");
    duration.textContent = `${task.duration / 60000}분`;
    info.append(title, duration);
    li.append(n, info);
    for (const [label, action, disabled] of [
      ["↑", () => move(i, -1), i === 0],
      ["↓", () => move(i, 1), i === s.tasks.length - 1],
      ["수정", () => edit(i), false],
      ["×", () => save(s.tasks.filter((_, j) => i !== j)), false],
    ]) {
      const b = document.createElement("button");
      b.textContent = label;
      b.disabled = busy() || disabled;
      b.setAttribute(
        "aria-label",
        `${task.title} ${label === "×" ? "삭제" : label}`,
      );
      b.onclick = action;
      li.append(b);
    }
    $("tasks").append(li);
  });
}
const save = (tasks) => command("save", tasks);
function move(i, d) {
  const tasks = [...state.tasks];
  [tasks[i], tasks[i + d]] = [tasks[i + d], tasks[i]];
  save(tasks);
}
function edit(i) {
  const task = state.tasks[i],
    info = $("tasks").children[i].querySelector(".taskInfo");
  info.replaceChildren();
  const title = document.createElement("input"),
    minutes = document.createElement("input"),
    apply = document.createElement("button"),
    cancel = document.createElement("button");
  title.value = task.title;
  title.maxLength = 120;
  title.setAttribute("aria-label", "수정할 이름");
  minutes.type = "number";
  minutes.min = 1;
  minutes.max = 1440;
  minutes.value = task.duration / 60000;
  minutes.setAttribute("aria-label", "수정할 시간");
  apply.textContent = "저장";
  cancel.textContent = "취소";
  apply.onclick = () => {
    const n = Number(minutes.value);
    if (!Number.isInteger(n) || n < 1 || n > 1440 || !title.value.trim()) {
      $("message").textContent = "이름과 1~1440분을 입력해 주세요.";
      return;
    }
    const tasks = [...state.tasks];
    tasks[i] = { title: title.value, duration: n * 60000 };
    save(tasks);
  };
  cancel.onclick = () => {
    signature = "";
    render(state);
  };
  info.append(title, minutes, apply, cancel);
}
$("add").onsubmit = async (e) => {
  e.preventDefault();
  const n = Number($("minutes").value);
  if (!Number.isInteger(n) || n < 1 || n > 1440) return;
  if (
    await save([
      ...state.tasks,
      { title: $("title").value, duration: n * 60000 },
    ])
  )
    $("title").value = "";
};
$("start").onclick = () =>
  command(state.status === "running" ? "pause" : "start");
$("extend").onclick = () => command("extend");
$("skip").onclick = () => command("skip");
$("reset").onclick = () => {
  if (!busy() || confirm("진행 시간을 초기화할까요? 목록은 유지됩니다."))
    command("reset");
};
$("test").onclick = () => command("test");
window.timerApp.onState(render);
command("get");
