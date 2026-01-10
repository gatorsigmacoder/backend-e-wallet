export enum TransactionType {
  PURCHASE = "purchase",
  TRANSFER = "transfer",
  TOP_UP = "top_up",
  FEE = "fee",
  REFUND = "refund",
  ADJUSTMENT = "adjustment",
}

export enum TransactionStatus {
  IN_QUEUE = "in_queue",
  DONE = "done",
  FAIL = "fail",
}
