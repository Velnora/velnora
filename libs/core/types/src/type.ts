export interface Type<TClass> {
  new (...args: any[]): TClass;
}
