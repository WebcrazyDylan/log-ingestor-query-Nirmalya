export type Log = {
  level: string;
  message: string;
  resourceId: string;
  timestamp: Date;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: {
    parentResourceId: string;
  };
};
