// import type { VelnoraPlugin } from "../types/velnora-plugin";
//
// export const orderPlugins = (plugins: VelnoraPlugin[]): VelnoraPlugin[] => {
//   // 1) group by enforce (pre -> none -> post)
//   const pre: VelnoraPlugin[] = [];
//   const mid: VelnoraPlugin[] = [];
//   const post: VelnoraPlugin[] = [];
//   for (const p of plugins) {
//     if (p.enforce === "pre") pre.push(p);
//     else if (p.enforce === "post") post.push(p);
//     else mid.push(p);
//   }
//   const ordered = [...pre, ...mid, ...post];
//
//   // 2) soft after/before constraints (stable, best-effort)
//   const nameToIndex = () => new Map(ordered.map((p, i) => [p.name, i]));
//   let changed = true;
//   while (changed) {
//     changed = false;
//     const index = nameToIndex();
//     for (let i = 0; i < ordered.length; i++) {
//       const p = ordered[i];
//       // move p after deps in p.after
//       for (const dep of p.after ?? []) {
//         const j = index.get(dep);
//         if (j != null && j > -1 && j > i) {
//           // dep is after p; swap to make dep before p
//           [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
//           changed = true;
//           break;
//         }
//       }
//       if (changed) break;
//       // move p before deps in p.before
//       for (const dep of p.before ?? []) {
//         const j = index.get(dep);
//         if (j != null && j > -1 && j < i) {
//           // dep is before p; swap to make p before dep
//           [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
//           changed = true;
//           break;
//         }
//       }
//       if (changed) break;
//     }
//   }
//   return ordered;
// };
