const { test } = require("node:test");
const assert = require("node:assert/strict");
const { Timer } = require("../timer.cjs");
function fixture() {
  let time = 0;
  return {
    timer: new Timer(
      [
        { title: "작성", duration: 60000 },
        { title: "휴식", duration: 30000 },
      ],
      () => time,
    ),
    at: (n) => (time = n),
  };
}
test("automatic advance and completion exactly once", () => {
  const { timer: t, at } = fixture();
  t.start();
  at(60000);
  assert.deepEqual(t.tick(), [{ title: "작성", next: "휴식" }]);
  assert.equal(t.snapshot().remaining, 30000);
  at(90000);
  assert.deepEqual(t.tick(), [{ title: "휴식", next: null }]);
  assert.equal(t.status, "done");
  assert.deepEqual(t.tick(), []);
});
test("pause, extend, resume, skip and restart", () => {
  const { timer: t, at } = fixture();
  t.start();
  at(10000);
  t.pause();
  at(500000);
  assert.equal(t.snapshot().remaining, 50000);
  t.extend();
  assert.equal(t.remaining, 350000);
  t.start();
  t.skip();
  assert.equal(t.snapshot().remaining, 30000);
  t.pause();
  t.skip();
  assert.equal(t.status, "done");
  t.start();
  assert.equal(t.index, 0);
});
test("sleep catches up without deadline drift", () => {
  const { timer: t, at } = fixture();
  t.start();
  at(85000);
  assert.equal(t.tick().length, 1);
  assert.equal(t.snapshot().remaining, 5000);
  at(1000000);
  assert.equal(t.tick().length, 1);
  assert.equal(t.status, "done");
});
test("input validation and locked in-progress edits", () => {
  assert.throws(() => new Timer([{ title: "", duration: 60000 }]));
  assert.throws(() => new Timer([{ title: "x", duration: Infinity }]));
  const { timer: t } = fixture();
  t.start();
  assert.throws(() => t.setTasks([]));
  t.reset();
  t.setTasks([]);
  assert.throws(() => t.start());
});
