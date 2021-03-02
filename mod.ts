import { FetchMetrics, metrics as fetchMetrics } from "./src/fetch.ts";
import { FilesystemMetrics, metrics as fsMetrics } from "./src/fs.ts";

export type { FetchMetrics, FilesystemMetrics };

/** Metrics of various operations in the Deno runtime. */
export interface Metrics {
  fetch: FetchMetrics;
  fs: FilesystemMetrics;
}

export function metrics(): Metrics {
  const resources = Deno.resources();
  const resourceNames: string[] = Object.values(resources);
  const { ops } = Deno.metrics();
  return {
    fetch: fetchMetrics(resourceNames, ops),
    fs: fsMetrics(resourceNames, ops),
  };
}
