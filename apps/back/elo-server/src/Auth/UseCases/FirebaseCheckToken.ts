import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

import { EnvEnum, InfraEnum } from 'elo/back/core/Shared';
import { getEnv } from 'elo/back/core/Shared';

const ELOCUENCY_INFRA_PREFIX = '?';

@Injectable()
export class FirebaseCheckToken {
  // TODO: Move to a env variable
  private readonly proxyGoogleFunctionUrl =
    'https://googleauthverify-iexlu5i3ga-uc.a.run.app';
  private readonly publicKeyUrl =
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
  private readonly secureTokenUrl = 'https://securetoken.google.com/';

  constructor(private readonly configService: ConfigService) {}
  async verifyToken(idToken: string): Promise<any> {
    if (
      getEnv().infra === InfraEnum.awsProd ||
      getEnv().infra === InfraEnum.awsStg
    ) {
      // ByProxyGoogleFunction
      return this.verifyTokenByProxyGoogleFunction(idToken);
    } else {
      // ByGoogleUrl
      return this.verifyTokenByGoogleUrl(idToken);
    }
  }

  async verifyTokenByProxyGoogleFunction(idToken: string): Promise<any> {
    // TODO: Create a adapter to allow use on Azure
    const client = new LambdaClient();
    const params = {
      FunctionName: ELOCUENCY_INFRA_PREFIX + 'proxy-to-internet', // TODO: Replace for a enum and env variable
      Payload: JSON.stringify({
        url: this.proxyGoogleFunctionUrl,
        method: 'GET',
        // body: { idToken },
      }),
    };

    try {
      console.log(
        'ºº ~ file: FirebaseCheckToken.ts:44 ~ FirebaseCheckToken ~ verifyTokenByProxyGoogleFunction ~ params:',
        params
      );
      const command = new InvokeCommand(params);
      const response = await client.send(command);

      console.log(
        'ºº ~ file: FirebaseCheckToken.ts:87 ~ FirebaseCheckToken ~ fetchProxyLambdaPublicKeys ~ response:',
        { response, command }
      );

      const payloadString = response.Payload
        ? Buffer.from(response.Payload).toString('utf-8')
        : '{}';
      return JSON.parse(payloadString);
    } catch (error) {
      console.error('Error invoking proxy Lambda:', error);
      throw new Error('Error invoking proxy Lambda');
    }
  }

  /*
    This service is used to verify Firebase ID tokens. Because Firebase ID tokens are OpenID 
    Connect tokens, you can just use the `jsonwebtoken` library to verify them. 
    The `firebase-admin` library is not required for this operation and v12.1.0 failed: 
        const appCheckClaims = await firebase.auth().currentUser.getIdToken(params.providerToken);
        return:  ERROR [ExceptionsHandler] The provided App Check token has incorrect "aud" (audience) claim. Expected "projects/elocuency-e6a90" but got "elocuency-e6a90". Make sure the App Check token comes from the same Firebase project as the service account used to authenticate this SDK.
  */
  async verifyTokenByGoogleUrl(idToken: string): Promise<any> {
    console.log(
      'ºº ~ file: FirebaseCheckToken.ts:69 ~ FirebaseCheckToken ~ verifyTokenByGoogleUrl ~ idToken:',
      idToken
    );
    try {
      const keys = await this.fetchPublicKeys();

      const firebaseProjectId = this.configService.get<string>(
        EnvEnum.firebaseProjectId
      );
      const decodedToken = jwt.decode(idToken, { complete: true });

      if (!decodedToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const { kid, alg } = decodedToken.header;
      console.log(
        'ºº ~ file: firebase-check-token.ts:31 ~ FirebaseCheckToken ~ verifyToken ~ decodedToken:',
        { decodedToken, kid, alg, keys }
      );
      if (!kid || !alg) {
        throw new UnauthorizedException('Invalid token header');
      }

      const key = keys[kid];
      if (!key) {
        throw new UnauthorizedException('Invalid token key ID');
      }

      return jwt.verify(idToken, key, {
        algorithms: [alg as jwt.Algorithm],
        audience: firebaseProjectId,
        issuer: `${this.secureTokenUrl}${firebaseProjectId}`,
      });
    } catch (error) {
      throw new UnauthorizedException(
        'Token verification failed',
        error.message
      );
    }
  }

  private async fetchPublicKeys(): Promise<{ [key: string]: string }> {
    const response = await fetch(this.publicKeyUrl);
    console.log(
      'ºº ~ file: FirebaseCheckToken.ts:66 ~ FirebaseCheckToken ~ fetchPublicKeys ~ response:',
      { response, url: this.publicKeyUrl }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch public keys: ${response.statusText}`);
    }
    return await response.json();
  }
}
