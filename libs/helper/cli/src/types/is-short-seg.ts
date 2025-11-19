export type IsShortSeg<T extends string> = T extends `-${string}` ? (T extends `--${string}` ? false : true) : false;
