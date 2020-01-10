export type ExtractParameterType<T, N extends number> = T extends (
  ...args: any[]
) => any
  ? Pick<Parameters<T>, N>[keyof Pick<Parameters<T>, N>] extends undefined
    ? never
    : Pick<Parameters<T>, N>[keyof Pick<Parameters<T>, N>]
  : never;
