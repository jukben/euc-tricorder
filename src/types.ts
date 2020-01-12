export type ExtractParameterType<T, N extends number> = T extends (
  ...args: any[]
) => any
  ? Pick<Parameters<T>, N>[keyof Pick<Parameters<T>, N>] extends undefined
    ? never
    : Pick<Parameters<T>, N>[keyof Pick<Parameters<T>, N>]
  : never;

export type CustomNavigatorProps<
  Navigation,
  Stack extends Record<string, object | undefined>,
  Route extends keyof Stack
> = {
  navigation: Navigation;
  route: { name: Route; params: Stack[Route] };
};
