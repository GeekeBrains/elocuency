import { getEnv, InfraEnum } from './getEnv';

export function getAwsConfig() {
  let awsConfig = {};
  if (getEnv().infra == InfraEnum.localstack) {
    if (process.env.LOCALSTACK_HOSTNAME) {
      // Inside localstack container
      awsConfig = {
        region: getEnv().infraRegion,
        endpoint: `http://localstack:4566`,
        credentials: {
          accessKeyId: 'dummy',
          secretAccessKey: 'dummy',
        },
      };
    } else {
      // Outside localstack container, on dev enviroment
      awsConfig = {
        region: getEnv().infraRegion,
        endpoint: `http://localhost:4566`,
        credentials: {
          accessKeyId: 'dummy',
          secretAccessKey: 'dummy',
        },
      };
    }
  } else {
    awsConfig = {
      region: getEnv().infraRegion,
      endpoint: getEnv().infraEndpoint,
      credentials: {
        accessKeyId: getEnv().infraAccessKeyId,
        secretAccessKey: getEnv().infraSecretAccessKey,
      },
    };
  }

  // console.log(
  //   'ºº ~ file: getAwsConfig.ts:24 ~ getAwsConfig ~ awsConfig:',
  //   awsConfig
  // );
  return awsConfig;
}
