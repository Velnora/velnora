interface TsInjectImportParams {
  file: string;
  importName: string;
  from: string;
  isDefault?: boolean;
}

interface TsAddToNgModuleParams {
  file: string;
  arrayName: "imports" | "providers" | "controllers";
  exprCode: string;
  uniqueKey?: string;
}

export interface AstApi {
  tsInjectImport(params: TsInjectImportParams): void;
  tsAddToNgModule(params: TsAddToNgModuleParams): void;
}
