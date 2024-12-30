// custom-api-property.decorator.ts
import { ApiProperty } from '@nestjs/swagger';

export type PropertyParamsType = {
  type?: any;
  description?: string;
  isPrimaryKey?: boolean;
  index?: boolean | { sortKey?: string; project?: boolean | string[] };
  enum?: any;
  required?: boolean;
  dbSchema?: any;
  fusionKey?: string[];
  // notSyncToDb?: boolean;
};

export function EloProperty(params?: PropertyParamsType): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.defineMetadata('@Property', params, target, propertyKey);

    // Verifica si Swagger está disponible
    const swaggerAvailable = typeof ApiProperty === 'function';
    if (swaggerAvailable) {
      const optionsSwagger = { ...params };
      const metaType = Reflect.getMetadata('design:type', target, propertyKey);

      // console.log(
      //   'ºº ~ file: field-decorator.ts:27 ~ return ~ optionsSwagger:',
      //   { options, target, propertyKey, optionsSwagger },
      //   String(metaType),
      //   metaType.name
      // );
      // Si Swagger está disponible, aplica el decorador ApiProperty
      if (optionsSwagger?.isPrimaryKey) {
        delete optionsSwagger['isPrimaryKey'];
      }

      if (optionsSwagger?.index) {
        delete optionsSwagger['index'];
      }

      if (optionsSwagger?.dbSchema) {
        delete optionsSwagger['dbSchema'];
      }

      if (optionsSwagger?.enum) {
        optionsSwagger.type = String(metaType);
      }

      ApiProperty(optionsSwagger)(target, propertyKey);
    }
  };
}
