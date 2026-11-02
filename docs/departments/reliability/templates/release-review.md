# Release review

What the release role returns when the coordinator asks whether the packages can ship. It is evidence for the maintainer's decision, never the decision.

```md
🤖 Reliability release: <Ready | Not ready> for <the packages and the version or tag considered>

**Checked at:** <the commit hash>

**Checks run:**

| Command                   | Result                                              |
| ------------------------- | --------------------------------------------------- |
| `<the exact command run>` | <passed / failed, and whether the failure is known> |

**Installable:** <how a packed tarball was installed and imported in a fresh project, and what happened>

**Node versions:** <the versions checked against each package's `engines`>

**Changesets:** <the pending changesets and the bumps they make>

**Blockers, if any:**

1. <what stops the release, and which role owns the fix>
```
