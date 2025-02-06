export interface WorkerCallMessage {
  type: "fn:call";
  fn: string;
  args: any[];
}

export interface WorkerCallResult {
  type: "fn:call:result";
  fn: string;
  result: any;
}
