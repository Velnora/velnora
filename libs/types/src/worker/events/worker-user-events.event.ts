export interface WorkerUserEventsEvent {
  type: "fn:userEvent";
  userEvent: string;
  data: any;
}
