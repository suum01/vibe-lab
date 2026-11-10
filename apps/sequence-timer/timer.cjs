class Timer {
  constructor(tasks = [], clock = Date.now) {
    this.clock = clock;
    this.tasks = this.validate(tasks);
    this.reset();
  }
  validate(tasks) {
    if (!Array.isArray(tasks) || tasks.length > 100)
      throw Error("할 일은 최대 100개입니다.");
    return tasks.map((t) => {
      if (
        !t ||
        typeof t.title !== "string" ||
        !t.title.trim() ||
        t.title.length > 120 ||
        !Number.isInteger(t.duration) ||
        t.duration < 1000 ||
        t.duration > 86400000
      )
        throw Error("이름과 올바른 시간을 입력해 주세요.");
      return { title: t.title.trim(), duration: t.duration };
    });
  }
  reset() {
    this.status = "idle";
    this.index = 0;
    this.deadline = null;
    this.remaining = this.tasks[0]?.duration || 0;
  }
  setTasks(tasks) {
    if (["running", "paused"].includes(this.status))
      throw Error("초기화한 뒤 수정해 주세요.");
    this.tasks = this.validate(tasks);
    this.reset();
  }
  start() {
    if (!this.tasks.length) throw Error("할 일을 먼저 추가해 주세요.");
    if (this.status === "running") return;
    if (this.status === "done") this.reset();
    this.deadline = this.clock() + this.remaining;
    this.status = "running";
  }
  pause() {
    if (this.status === "running") {
      this.remaining = Math.max(0, this.deadline - this.clock());
      this.deadline = null;
      this.status = "paused";
    }
  }
  extend() {
    if (this.status === "running") this.deadline += 300000;
    else if (this.status === "paused") this.remaining += 300000;
  }
  advance() {
    if (++this.index >= this.tasks.length) {
      this.status = "done";
      this.remaining = 0;
      this.deadline = null;
    } else {
      this.remaining = this.tasks[this.index].duration;
      if (this.status === "running")
        this.deadline = this.clock() + this.remaining;
    }
  }
  skip() {
    if (["running", "paused"].includes(this.status)) this.advance();
  }
  tick() {
    const events = [];
    while (this.status === "running" && this.clock() >= this.deadline) {
      const title = this.tasks[this.index].title,
        end = this.deadline;
      this.advance();
      if (this.status === "running") this.deadline = end + this.remaining;
      events.push({ title, next: this.tasks[this.index]?.title || null });
    }
    return events;
  }
  snapshot() {
    return {
      tasks: this.tasks,
      index: this.index,
      status: this.status,
      remaining:
        this.status === "running"
          ? Math.max(0, this.deadline - this.clock())
          : this.remaining,
    };
  }
}
module.exports = { Timer };
