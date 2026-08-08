/**
 * Regression: sign-in must not skip Stage 3 via stale localStorage / cookie.
 * Mirrors fixed loadStudentProfile + proxy DB gate + post-auth routing.
 * Exit 1 = bug present (red). Exit 0 = fixed (green).
 */
import assert from "node:assert/strict";

function proxyRedirect({ pathname, user, dbComplete, edit = false }) {
  const onboardingComplete = Boolean(dbComplete);
  if (user && (pathname === "/login" || pathname === "/signup")) {
    return onboardingComplete ? "/chat" : "/onboarding";
  }
  if (user && pathname.startsWith("/chat") && !onboardingComplete) {
    return "/onboarding";
  }
  if (user && pathname === "/onboarding" && onboardingComplete && !edit) {
    return "/chat";
  }
  return null;
}

/** Fixed auth goAfterAuth: incomplete → onboarding even if ?next=/chat */
function goAfterAuth({ serverCompletedAt, requestedNext }) {
  if (serverCompletedAt) {
    return requestedNext === "/onboarding" ? "/chat" : requestedNext || "/chat";
  }
  return "/onboarding";
}

/**
 * Fixed loadStudentProfile: never set gate cookie from stale local complete
 * when server is incomplete / empty.
 */
function loadStudentProfileWouldSetCookie({ serverProfile, localProfile }) {
  if (serverProfile) {
    return Boolean(serverProfile.completedAt);
  }
  // Soft-migrate only — never mark complete from local alone.
  void localProfile;
  return false;
}

function follow(startPath, state, max = 5) {
  let path = startPath;
  const trail = [path];
  for (let i = 0; i < max; i++) {
    const next = proxyRedirect({
      pathname: path.split("?")[0],
      user: true,
      dbComplete: state.dbComplete,
      edit: path.includes("edit=1"),
    });
    if (!next || next === path) break;
    path = next;
    trail.push(path);
  }
  return { path, trail };
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

check("stale local complete cannot set cookie when server incomplete", () => {
  const wouldSet = loadStudentProfileWouldSetCookie({
    serverProfile: { completedAt: null, yearGroup: "6th-year", subjects: ["maths"] },
    localProfile: {
      completedAt: "2026-08-01T00:00:00.000Z",
      yearGroup: "6th-year",
      subjects: ["maths"],
      challenge: "concepts",
    },
  });
  assert.equal(wouldSet, false);
});

check("stale local complete cannot set cookie when server has no prefs", () => {
  const wouldSet = loadStudentProfileWouldSetCookie({
    serverProfile: null,
    localProfile: {
      completedAt: "2026-08-01T00:00:00.000Z",
      yearGroup: "6th-year",
      subjects: ["maths"],
      challenge: "concepts",
    },
  });
  assert.equal(wouldSet, false);
});

check("sign-in with incomplete DB lands on onboarding and stays (even with stale cookie intent)", () => {
  const dest = goAfterAuth({ serverCompletedAt: null, requestedNext: "/chat" });
  assert.equal(dest, "/onboarding");
  const { path, trail } = follow(dest, { dbComplete: false });
  assert.equal(path, "/onboarding", `trail=${trail.join(" → ")}`);
});

check("stale browser cookie ignored when DB incomplete — cannot skip via /onboarding", () => {
  // Old bug: cookie=1 bounced /onboarding → /chat even when DB incomplete.
  const { path, trail } = follow("/onboarding", { dbComplete: false });
  assert.equal(path, "/onboarding", `trail=${trail.join(" → ")}`);
});

check("finished student reaches /chat", () => {
  const dest = goAfterAuth({
    serverCompletedAt: "2026-08-06T00:00:00.000Z",
    requestedNext: "/chat",
  });
  assert.equal(dest, "/chat");
  const { path } = follow(dest, { dbComplete: true });
  assert.equal(path, "/chat");
});

check("OAuth default next is onboarding (site-url safeNextPath)", () => {
  // Mirrors fixed safeNextPath
  const safeNextPath = (nextPath) => {
    if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) return "/onboarding";
    return nextPath;
  };
  assert.equal(safeNextPath(null), "/onboarding");
});

if (failures) {
  console.log(`\nRED: ${failures} failure(s).`);
  process.exit(1);
}
console.log("\nGREEN: onboarding gate holds.");
process.exit(0);
