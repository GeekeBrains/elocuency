export interface PushToFrontMsgPort {
  push(subscription: any, payload: any): Promise<void>;
}
