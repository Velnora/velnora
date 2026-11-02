import { findAccessViolation } from "./find-access-violation.mjs";

const chunks = [];
for await (const chunk of process.stdin) {
  chunks.push(chunk);
}

let reason;
try {
  reason = findAccessViolation(JSON.parse(Buffer.concat(chunks).toString("utf8")));
} catch (error) {
  reason = `The department-access hook failed, so the call is blocked to be safe: ${error.message}`;
}

if (reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason
      }
    })
  );
}
