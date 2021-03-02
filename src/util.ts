export function count<T>(arr: T[], item: T): number {
  return arr.filter((i) => i === item).length;
}

export function details(
  ops: Record<string, Deno.OpMetrics>,
  op: string,
): [ongoing: number, completed: number] {
  const details = ops[op];
  const dispatched = details?.opsDispatched ?? 0;
  const completed = details?.opsCompleted ?? 0;
  return [dispatched - completed, completed];
}

export function detailsAll(
  ops: Record<string, Deno.OpMetrics>,
  op: string,
): [ongoing: number, completed: number] {
  const async = details(ops, `${op}_async`);
  const sync = details(ops, `${op}_sync`);
  return [async[0] + sync[0], async[1] + sync[1]];
}
