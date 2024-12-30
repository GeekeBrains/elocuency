import 'reflect-metadata';
export type EntityIndexType = {
  primaryKey?: boolean;
  uniqueKey?: boolean;
  fields: string[];
  // global?: boolean;
  // project?: boolean | string[];
};

export type EntityParamsType = {
  name: string;
  description?: string;
  indexes: {
    [key: string]: EntityIndexType;
  };
};

export function Injectable() {
  return function (target: any) {
    Reflect.defineMetadata('injectable', true, target);
  };
}

export const entityDecoratorSymbol = Symbol('entity');
export const EloEntity = (params?: EntityParamsType): ClassDecorator => {
  // console.log('ºº ~ file: EntityDecorator.ts ~ params', params);
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function) => {
    Reflect.defineMetadata(entityDecoratorSymbol, params, target);
    // let topicFns: Array<() => void> = Reflect.getMetadata(
    //   'topicCallbacks',
    //   target.prototype
    // );
    // if (topicFns) {
    //   topicFns.forEach((fn) => fn());
    // }
    // return target;
  };
};
