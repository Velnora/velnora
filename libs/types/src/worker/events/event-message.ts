export interface EventMessage<TKey extends string = string, TData = any> {
  event: TKey;
  data: TData;
}
