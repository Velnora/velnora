---
paths:
  - "**/*.md"
---

# Markdown Rules

## Tables

Tables follow the [GFM table spec](https://github.github.com/gfm/#tables-extension-) and markdownlint's table rules, in markdownlint's aligned style.

- Always leave tables formatted: every column padded so its pipes line up vertically in every row, the header and delimiter rows included (markdownlint [MD060](https://github.com/DavidAnson/markdownlint/blob/main/doc/md060.md), `style: aligned`, `aligned_delimiter: true`).
- Each column is as wide as its widest cell. Pad every other cell with trailing spaces, and fill each delimiter cell with hyphens to that width, colons included.
- Exactly one space between each pipe and the cell content.
- A leading and trailing pipe on every row ([MD055](https://github.com/DavidAnson/markdownlint/blob/main/doc/md055.md), `leading_and_trailing`).
- Every row has as many cells as the header ([MD056](https://github.com/DavidAnson/markdownlint/blob/main/doc/md056.md)). Leave a cell empty rather than dropping it.
- A blank line before and after every table ([MD058](https://github.com/DavidAnson/markdownlint/blob/main/doc/md058.md)).
- Alignment colons in the delimiter row only for a column that needs centering (`:---:`) or right alignment (`---:`), such as numbers.
- Escape a literal pipe inside a cell as `\|`, inside code spans too.
- Width is display width: a CJK character or an emoji takes two columns.
- Editing one cell can change its column's width, so re-align the whole table after every edit, not only the touched row.
- A table cell can't hold block content (lists, paragraphs, code blocks). When a cell needs it, use a list or headings instead of a table.

```md
| Department    | Roles                | Model  |
| ------------- | -------------------- | ------ |
| Product       | coordinator, analyst | Opus   |
| Core platform | architect, reviewer  | Opus   |
| Reliability   | qa                   | Sonnet |
```
