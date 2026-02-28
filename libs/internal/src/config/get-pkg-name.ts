/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

export const getPkgName = (name?: string) => (!name ? "velnora" : name.match(/^velnora\.?/) ? name : `velnora.${name}`);
