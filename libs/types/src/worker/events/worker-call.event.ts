export interface WorkerCallMessage {
  fn: string;
  args: any[];
}

export interface WorkerCallResult {
  fn: string;
  result: any;
}
