import { IsString, IsNumber, IsOptional } from 'class-validator';

export enum EnvTypeEnum {
  local = 'local', // Local development on machine without dockers, to test process know enviroment
}
export enum InfraEnum {
  awsProd = 'aws-prod',
  awsStg = 'aws-stg',
  localstack = 'localstack',
}

/*
  Vars with "ELOCUENCY_" prefix are global for all enviroment, loaded on user linux profile
  all the rest vars come from .env file.
*/
export enum EnvEnum {
  env = 'ELOCUENCY_ENV',
  infra = 'ELOCUENCY_INFRA',
  infraPrefix = 'ELOCUENCY_INFRA_PREFIX',
  infraRegion = 'ELOCUENCY_INFRA_REGION',
  infraEndpoint = 'ELOCUENCY_INFRA_ENDPOINT',
  infraAccessKeyId = 'ELOCUENCY_INFRA_ACCESS_KEY_ID',
  infraSecretAccessKey = 'ELOCUENCY_INFRA_SECRET_ACCESS_KEY',
  openAiApiKey = 'OPEN_AI_API_KEY',
  authJwtSecret = 'AUTH_JWT_SECRET',
  mysqlUrl = 'MYSQL_URL',
  mysqlUrlLocal = 'MYSQL_URL_LOCAL',
  firebaseProjectId = 'FIREBASE_PROJECT_ID',
  corsEnabledUrl = 'CORS_ENABLED_URL',
  serverPort = 'SERVER_PORT',
  appPrefix = 'APP_PREFIX',
  nestDebug = 'NEST_DEBUG',
  pushNotificationsPrivateVapid = 'PUSH_NOTIFICATIONS_PRIVATE_VAPID',
  pushNotificationsPublicVapid = 'PUSH_NOTIFICATIONS_PUBLIC_VAPID',
}

// To validate config on boostrap
export class EnvDef {
  @IsString()
  [EnvEnum.env]: EnvEnum;

  @IsString()
  [EnvEnum.infra]: InfraEnum;

  @IsString()
  [EnvEnum.infraRegion]: string;

  @IsString()
  [EnvEnum.infraPrefix]: string;

  @IsString()
  @IsOptional()
  [EnvEnum.infraEndpoint]?: string;

  @IsString()
  @IsOptional()
  [EnvEnum.infraAccessKeyId]?: string;

  @IsString()
  @IsOptional()
  [EnvEnum.infraSecretAccessKey]?: string;

  @IsString()
  [EnvEnum.openAiApiKey]: string;

  @IsString()
  [EnvEnum.authJwtSecret]: string;

  @IsString()
  [EnvEnum.mysqlUrl]: string;

  @IsString()
  [EnvEnum.firebaseProjectId]: string;

  @IsString()
  [EnvEnum.corsEnabledUrl]: string;

  @IsString()
  [EnvEnum.appPrefix]: string;

  @IsNumber()
  @IsOptional()
  [EnvEnum.serverPort]: number;
}

export const getEnv = () => {
  // console.log(
  //   'ºº ~ file: getEnv.ts:101 ~ getEnv ~ process.env:',
  //   process.env[EnvEnum.infra],
  //   process.env[EnvEnum.infra] as InfraEnum
  // );
  return {
    env: process.env[EnvEnum.env] as EnvEnum,
    infra: process.env[EnvEnum.infra] as InfraEnum,
    infraPrefix: process.env[EnvEnum.infraPrefix] as string,
    infraRegion: process.env[EnvEnum.infraRegion] as string,
    infraEndpoint: process.env[EnvEnum.infraEndpoint] as string,
    infraAccessKeyId: process.env[EnvEnum.infraAccessKeyId] as string,
    infraSecretAccessKey: process.env[EnvEnum.infraSecretAccessKey] as string,
    mysqlUrl:
      process.env[EnvEnum.env] !== EnvTypeEnum.local
        ? (process.env[EnvEnum.mysqlUrl] as string)
        : (process.env[EnvEnum.mysqlUrlLocal] as string),
    authJwtSecret: process.env[EnvEnum.authJwtSecret] as string,
    firebaseProjectId: process.env[EnvEnum.firebaseProjectId] as string,
    nestDebug: process.env[EnvEnum.nestDebug] as string,
    corsEnabledUrl: process.env[EnvEnum.corsEnabledUrl] as string,
    serverPort: process.env[EnvEnum.serverPort] as string,
    openaiApiKey: process.env[EnvEnum.openAiApiKey] as string,
    appPrefix: process.env[EnvEnum.appPrefix] as string,
    pushNotificationsPrivateVapid: process.env[
      EnvEnum.pushNotificationsPrivateVapid
    ] as string,
    pushNotificationsPublicVapid: process.env[
      EnvEnum.pushNotificationsPublicVapid
    ] as string,
  };
};
