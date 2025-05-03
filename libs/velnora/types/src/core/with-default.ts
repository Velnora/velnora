interface Default<TImport> {
  default: TImport;
}

export type WithDefault<TImport, TObject extends {} = {}> = Default<TImport> & TObject;
