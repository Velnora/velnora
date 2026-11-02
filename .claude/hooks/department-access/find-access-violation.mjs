import { commandTouchesEnvFile } from "./command-touches-env-file.mjs";
import { AGENT_GIT_SUBCOMMANDS, findForbiddenGitCall } from "./find-forbidden-git-call.mjs";
import { pathTargetsEnvFile } from "./path-targets-env-file.mjs";
import { stripHeredocBodies } from "./strip-heredoc-bodies.mjs";
import { stripPowerShellHereStrings } from "./strip-powershell-here-strings.mjs";

const ENV_FILE_OWNER = "reliability-release";
const PATH_FIELD = /path|file|glob|pattern/i;
const COMMAND_FIELD = /^command$/i;

const ENV_FILE_REASON =
  "`.env` belongs to the Reliability release role only (docs/departments/RULES.md > Secrets). Use `.env.example` to see which variables exist; to read or change a real value, ask the reliability-release agent.";
const AGENT_GIT_LIST = AGENT_GIT_SUBCOMMANDS.join(", ");

/**
 * Returns why a tool call breaks the departments' access rules, or null when it doesn't.
 * `agent_type` is present only inside a sub-agent (or an `--agent` session), so its absence means the main session.
 * Grep's `pattern` searches file contents, not paths, so it is not treated as a path.
 */
export const findAccessViolation = ({ tool_name: toolName, tool_input: toolInput = {}, agent_type: agentType }) => {
  const isEnvFileOwner = agentType === ENV_FILE_OWNER;
  const isMainSession = agentType === undefined;

  for (const [field, value] of Object.entries(toolInput)) {
    if (typeof value !== "string") {
      continue;
    }

    const isContentPattern = toolName === "Grep" && field === "pattern";
    if (PATH_FIELD.test(field) && !isContentPattern && !isEnvFileOwner && pathTargetsEnvFile(value)) {
      return ENV_FILE_REASON;
    }

    if (!COMMAND_FIELD.test(field)) {
      continue;
    }
    const command = stripPowerShellHereStrings(stripHeredocBodies(value));
    if (!isEnvFileOwner && commandTouchesEnvFile(command)) {
      return ENV_FILE_REASON;
    }
    const forbiddenGitCall = isMainSession ? null : findForbiddenGitCall(command);
    if (forbiddenGitCall) {
      return `\`${forbiddenGitCall}\` runs only in the main session, which is the Product coordinator (docs/departments/RULES.md > Git). A role may run only git ${AGENT_GIT_LIST}, and never \`commit --amend\`. Report back to the coordinator for branches, pushes, history rewrites and \`gh\`.`;
    }
  }

  return null;
};
