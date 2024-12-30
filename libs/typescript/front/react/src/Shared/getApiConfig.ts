import { Configuration as OpenApiConfig } from 'elo/back/server/open-api';
import { ApiFetchMethodEnum, getEnv } from 'elo/front/react/Shared';

export let openApiConfig: OpenApiConfig | null = null;
export function getOpenApiConfig() {
  if (openApiConfig) {
    return openApiConfig;
  }

  openApiConfig = new OpenApiConfig({
    basePath: getEnv().bffUrl,
    accessToken: async () => `Bearer ${getEnv().sessionToken}`,
    // baseOptions: {
    //   headers: {
    //     Authorization: `Bearer ${sessionToken}`,
    //   },
    // },
  });
  return openApiConfig;
}
