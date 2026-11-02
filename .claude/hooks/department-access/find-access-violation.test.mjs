import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { findAccessViolation } from "./find-access-violation.mjs";

const MAIN_SESSION = undefined;
const RELEASE = "reliability-release";
const ENGINEER = "core-engineer";

const call = (toolName, toolInput, agentType) => {
  return findAccessViolation({ tool_name: toolName, tool_input: toolInput, agent_type: agentType });
};

describe(".env access", () => {
  const envCalls = [
    ["Read", { file_path: "D:\\Projects\\velnora\\.env" }],
    ["Read", { file_path: "/repo/examples/monorepo/.env.local" }],
    ["Edit", { file_path: "/repo/.env", old_string: "A", new_string: "B" }],
    ["Write", { file_path: "/repo/.env", content: "A=1" }],
    ["Glob", { pattern: "**/.env*" }],
    ["Grep", { pattern: "SECRET", path: "/repo/.env" }],
    ["Grep", { pattern: "SECRET", glob: ".env" }],
    ["Bash", { command: "cat .env" }],
    ["Bash", { command: "head -5 ./libs/x/.env.local" }],
    ["Bash", { command: "node --env-file=.env main.js" }],
    ["PowerShell", { command: "Get-Content .env" }],
    ["Bash", { command: "cat > .env <<'EOF'\nA=1\nEOF" }],
    ["Bash", { command: "cat > body.md <<'EOF'\ntext\nEOF\ncat .env" }],
    ["PowerShell", { command: "$m = @'\ntext\n'@\nGet-Content .env" }]
  ];

  for (const [toolName, toolInput] of envCalls) {
    it(`denies ${toolName} ${JSON.stringify(toolInput)} to the main session and other agents`, () => {
      assert.match(call(toolName, toolInput, MAIN_SESSION), /release role only/);
      assert.match(call(toolName, toolInput, ENGINEER), /release role only/);
    });

    it(`allows ${toolName} ${JSON.stringify(toolInput)} to the release role`, () => {
      assert.equal(call(toolName, toolInput, RELEASE), null);
    });
  }

  const harmlessCalls = [
    ["Read", { file_path: "/repo/.env.example" }],
    ["Read", { file_path: "/repo/.envrc" }],
    ["Read", { file_path: "/repo/libs/types/src/config/velnora-environment.ts" }],
    ["Grep", { pattern: "\\.env", path: "/repo/docs" }],
    ["Write", { file_path: "/repo/docs/setup.md", content: "Copy .env.example to .env" }],
    ["Bash", { command: "cp .env.example /tmp/check" }],
    ["Bash", { command: 'node -e "console.info(process.env.PORT)"' }],
    ["PowerShell", { command: "$env:PORT" }],
    ["Bash", { command: "cat > body.md <<'EOF'\nOnly the release role touches `.env`.\nEOF" }],
    ["Bash", { command: "cat > notes.md <<-EOF\n\tcat .env\n\tEOF\necho done" }],
    ["PowerShell", { command: "git commit -F - @'\nOnly the release role touches `.env`.\n'@" }],
    ["PowerShell", { command: '$body = @"\ncat .env\n"@\necho $body' }]
  ];

  for (const [toolName, toolInput] of harmlessCalls) {
    it(`allows ${toolName} ${JSON.stringify(toolInput)} to everyone`, () => {
      assert.equal(call(toolName, toolInput, MAIN_SESSION), null);
      assert.equal(call(toolName, toolInput, ENGINEER), null);
    });
  }
});

describe("git and gh", () => {
  const pmOnlyCommands = [
    "git push",
    "gh pr create --fill",
    "gh pr view 74",
    "yarn nx test x && git push",
    "cd libs/x; git checkout -b feat/x master^0 --",
    "echo $(git rev-parse HEAD) && git reset --hard",
    '"C:/Program Files/Git/cmd/git.exe" push',
    "/usr/bin/git rebase master",
    "& git stash",
    "git -C libs/x push",
    "git -c alias.p=push p",
    "git commit --amend --no-edit",
    "git add a.ts && git commit --amend",
    "cat > body.md <<'EOF'\ntext\nEOF\ngit push",
    "env git push",
    "env -i git push",
    "env -u HOME git push",
    "env FOO=1 git push",
    "/usr/bin/env git push",
    "env gh pr view 1",
    "FOO=1 git push",
    'FOO="a b" git push',
    "FOO=$(date) BAR=2 git push",
    "command git push",
    "command -p git push",
    "exec git push",
    "nice git push",
    "nice -n 10 git push",
    "nohup git push",
    "time git push",
    "time -p gh pr list",
    "xargs git push",
    "ls | xargs -I {} git checkout {}",
    "echo push | xargs git",
    "echo push | xargs -0 git",
    "sudo git push",
    "sudo -u root git push",
    "sudo -E /usr/bin/git push",
    "sudo env FOO=1 nice -n 5 git push",
    "yarn build && FOO=1 nohup git commit --amend",
    "$m = @'\ntext\n'@\ngit push"
  ];

  for (const command of pmOnlyCommands) {
    it(`denies "${command}" to agents, including the release role`, () => {
      assert.match(call("Bash", { command }, ENGINEER), /main session/);
      assert.match(call("Bash", { command }, RELEASE), /main session/);
    });

    it(`allows "${command}" in the main session`, () => {
      assert.equal(call("Bash", { command }, MAIN_SESSION), null);
    });
  }

  const agentCommands = [
    "git status",
    "git diff master...HEAD",
    "git log --oneline -5",
    "git show HEAD --stat",
    "git blame src/main.ts",
    "git add libs/x/src/a.ts && git commit -F msg.txt",
    "git apply --cached hunk.patch",
    "git mv a.ts b.ts",
    "git -C libs/x diff --cached",
    '"C:/Program Files/Git/cmd/git.exe" status',
    "echo $(git rev-parse HEAD)",
    "git --version",
    "git commit -F - <<'EOF'\nfeat(x): add y\nEOF",
    "yarn nx run-many -t test",
    "echo git is fine",
    "git-lfs version",
    "ls .gitignore",
    "cat > steps.md <<'EOF'\ngit push\nEOF",
    "env git status",
    "env FOO=1 git diff",
    "FOO=1 git commit -F msg.txt",
    "command git log --oneline",
    "exec git status",
    "nice -n 10 git log",
    "nohup git show HEAD",
    "time git status",
    "git ls-files -z | xargs -0 git add",
    "sudo -u root git status",
    "sudo env FOO=1 nice git blame a.ts",
    "command -v git",
    "command -v gh",
    "command -V gh",
    'echo "env git push"',
    "echo env git push",
    "echo FOO=1 gh pr list",
    "env digit",
    "xargs digit push",
    "nice -n 10 yarn build",
    "env FOO=gh yarn test",
    "git commit -F - @'\ndocs: explain why git push stays with the coordinator\n'@"
  ];

  for (const command of agentCommands) {
    it(`allows "${command}" to agents`, () => {
      assert.equal(call("Bash", { command }, ENGINEER), null);
    });
  }
});
