export const hasValue = {
  number: (n: number) => !!n || n === 0,
  string: (s: string) => !/^\s*$/.test(s ?? ''),
  object: <T>(o: T) => Object.keys(o ?? {}).length > 0,
  array: <T>(a: T[]) => a?.length > 0,
};
