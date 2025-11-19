export type IsLongSeg<T extends string> = T extends `--${string}` ? true : false;
