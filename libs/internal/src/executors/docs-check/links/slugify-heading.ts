/** GitHub keeps Unicode letters and digits and replaces each space separately. */
export const slugifyHeading = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^\p{L}\p{N} _-]/gu, "")
    .replace(/ /g, "-");
