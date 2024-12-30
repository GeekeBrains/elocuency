// The enum standard fail on next, to send initialPage as a prop
export const EloFrontRoutesEnum = {
  chat: 'chat',
  login: 'login',
  signUp: 'sign-up',
  user: 'user',
} as const;
export type EloFrontRoutesType =
  (typeof EloFrontRoutesEnum)[keyof typeof EloFrontRoutesEnum];
// export enum EloFrontRoutesEnum {
//   chat = 'chat',
//   login = 'login',
//   signUp = 'signUp',
// }

// https://github.com/CodelyTV/awesome-typescript-examples/tree/main/src/const-type-parameter/fetcher

// Example from CodelyTV ----------------------------------------------

/* eslint-disable @typescript-eslint/no-unused-vars */
export type Route = {
  name: string;
  path: string;
  params: readonly string[];
};

function buildRouter<const T extends Route>(routes: T[]) {
  const getRoute = <
    RouteName extends T['name'],
    RouteParams extends Extract<T, { name: RouteName }>['params']
  >(
    name: RouteName,
    params: { [key in RouteParams[number]]: string }
  ): string => {
    const route = routes.find((n) => n.name && n.name === name)!.path;

    Object.entries<string>(params).forEach(([key, value]) => {
      route.replace(`:${key}`, value);
    });

    return route;
  };
  return { getRoute };
}

// Ejemplo de narrowing que explicando el porque funciona la firma anterior
type GeneratedRoutesType =
  | { name: 'login'; path: '/login'; params: [] }
  | { name: 'courses'; path: '/courses'; params: ['category'] };

type RouteNames = GeneratedRoutesType['name'];
//     ^?

type RouteParams = Extract<GeneratedRoutesType, { name: 'courses' }>['params'];
//     ^?

const { getRoute } = buildRouter([
  {
    name: 'login',
    path: '/login',
    params: [],
  },
  {
    name: 'courses',
    path: '/courses/:category',
    params: ['category'],
  },
]);

const route = getRoute('courses', { category: 'typescript' });

// Example from Advance CodelyTV ----------------------------------------------

/* eslint-disable @typescript-eslint/no-unused-vars */
/*
type ExtractRouteParams<T> = T extends `:${infer P}/${infer Rest}`
  ? P | ExtractRouteParams<`${Rest}`>
  : T extends `:${infer P}`
  ? P
  : T extends `${infer _Start}/${infer Rest}`
  ? ExtractRouteParams<Rest>
  : never;

type RouteParamsObject<T extends string> = {
  [key in T]: string;
};

export type Route = {
  name: string;
  path: string;
};

function buildRouter<const T extends Route>(routes: T[]) {
  const getRoute = <
    RouteName extends T["name"],
    RouteParams extends RouteParamsObject<
      ExtractRouteParams<Extract<T, { name: RouteName }>["path"]>
    >
  >(
    name: RouteName,
    params: RouteParams
  ): string => {
    const route = routes.find((n) => n.name && n.name === name)!.path;

    Object.entries<string>(params).forEach(([key, value]) => {
      route.replace(`:${key}`, value);
    });

    return route;
  };
  return { getRoute };
}

// Ejemplo de narrowing que explicando el porque funciona la firma anterior
type GeneratedRoutesType =
  | { name: "login"; path: "/login"; params: [] }
  | { name: "courses"; path: "/courses/:category/:year"; params: ["category"] };

type RouteNames = GeneratedRoutesType["name"];
//     ^?

type RouteParams = Extract<GeneratedRoutesType, { name: "courses" }>["params"];
//     ^?

type RoutePath = Extract<GeneratedRoutesType, { name: "courses" }>["path"];
//     ^?

const { getRoute } = buildRouter([
  {
    name: "login",
    path: "/login",
  },
  {
    name: "courses",
    path: "/courses/:category",
  },
]);

const route = getRoute("courses", { category: "TypeScript" });
*/
