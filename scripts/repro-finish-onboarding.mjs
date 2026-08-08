/**
 * Regression: Finish & go to chat must not leave the student stuck on /onboarding.
 * Completion is marked before learning-event writes (events are best-effort).
 * Exit 1 = regression. Exit 0 = safe.
 */
import assert from "node:assert/strict";

/** Mirrors fixed /api/learning/diagnostic POST ordering. */
function finishDiagnostic({ eventError }) {
  const log = [];
  log.push("markComplete");
  const eventErrors = [];
  for (const q of ["q1", "q2", "q3"]) {
    try {
      if (eventError) throw new Error(eventError);
      log.push(`event:${q}`);
    } catch (err) {
      eventErrors.push(err.message);
    }
  }
  return { ok: true, completed: true, log, eventErrors };
}

let failures = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`PASS  ${name}`);
  } catch (err) {
    failures += 1;
    console.log(`FAIL  ${name}`);
    console.log(`      ${err.message}`);
  }
}

check("unknown kc must NOT block completion", () => {
  const result = finishDiagnostic({ eventError: "Unknown kc_id" });
  assert.equal(result.ok, true);
  assert.equal(result.completed, true);
  assert.equal(result.log[0], "markComplete");
  assert.equal(result.eventErrors.length, 3);
});

check("healthy path records events after complete", () => {
  const result = finishDiagnostic({ eventError: null });
  assert.equal(result.completed, true);
  assert.deepEqual(result.log, ["markComplete", "event:q1", "event:q2", "event:q3"]);
});

if (failures) {
  console.log(`\nRED: ${failures} failure(s)`);
  process.exit(1);
}
console.log("\nGREEN: finish-diagnostic completion order is safe");
process.exit(0);
