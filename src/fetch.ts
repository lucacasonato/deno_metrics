import { count, details } from "./util.ts";

/** Metrics related to `fetch` requests. */
export interface FetchMetrics {
  /** The amount of requests that have been initiated. This means that the
   * requests' headers have been sent to the server. */
  initiated: number;
  /** The amount of requests that are waiting on a response from the server. */
  waiting: number;
  /** The amount of requests where the client is currently sending data to the
   * server. */
  sending: number;
  /** The amount of requests where the client is currently receiving data from
   * the server. */
  receiving: number;
  /** The amount of requests that are completly done. These are all of the
   * requests data where the client is done sending and receiving data. */
  completed: number;
}

export function metrics(
  resourceNames: string[],
  ops: Record<string, Deno.OpMetrics>,
): FetchMetrics {
  const [initiated, sendCompleted] = details(ops, "op_fetch_send");

  const sending = count(resourceNames, "fetchRequestBody");
  const receiving = count(resourceNames, "fetchResponseBody");

  const completed = sendCompleted - receiving;

  return {
    initiated: initiated - completed,
    waiting: initiated - sendCompleted,
    sending,
    receiving,
    completed,
  };
}
