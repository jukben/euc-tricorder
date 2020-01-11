import { StackNavigationProp } from '@react-navigation/stack';

export type ExtractParameterType<T, N extends number> = T extends (
  ...args: any[]
) => any
  ? Pick<Parameters<T>, N>[keyof Pick<Parameters<T>, N>] extends undefined
    ? never
    : Pick<Parameters<T>, N>[keyof Pick<Parameters<T>, N>]
  : never;

export type CustomNavigatorProps<
  Stack extends Record<string, object | undefined>,
  Route extends keyof Stack
> = {
  navigation: StackNavigationProp<Stack>;
  route: { name: Route; params: Stack[Route] };
};
