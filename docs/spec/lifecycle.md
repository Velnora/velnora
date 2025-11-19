* Stage order: **configure → scaffold → build → runtime**.
* Ordering within a stage: **toposort by requires/provides**, then `priority`, then package name.
* Failure policy: missing required capability ⇒ **planning error** (pre-apply).
* Conflict policy: duplicate `http:ssr` per appSchema ⇒ **error**; duplicate route+method ⇒ **error**; middleware order ties resolved by package name.

**Done when:** you can predict which plugins run first at each stage and why.
