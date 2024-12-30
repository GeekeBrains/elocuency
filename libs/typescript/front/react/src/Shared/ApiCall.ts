// import Axios from 'axios';

// const URL_BASE = 'http:' + window.location.href.split(':')[1] + ':3000';

// Axios.interceptors.request.use(
//   (config) => {
//     // Do something before request is sent
//     // console.log(config);
//     return config;
//   },
//   (error) => {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

// const apiGet = (endpoint: string, data: any, dataResp: any) => {
//   return apiCall('get', endpoint, data, dataResp);
// };

// const apiPost = (endpoint: string, data: any, dataResp?: any) => {
//   return apiCall('post', endpoint, data, dataResp);
// };

// const apiCall = async (
//   method: string,
//   endpoint: string,
//   data: any,
//   dataResp?: any
// ) => {
//   console.log('ºº ~ file: ApiCall.ts:35 ~ endpoint:', endpoint);
//   const axiosResp = await Axios({
//     method,
//     url: `${URL_BASE}${endpoint}`,
//     data,
//     headers: {
//       // Authorization: `Bearer ${token}`,
//     },
//   });

//   console.log('apiCall', axiosResp);
//   if (dataResp && dataResp.onResponse && axiosResp.statusText === 'OK') {
//     // console.log('apiCall onResponse', axiosResp);
//     dataResp.onResponse(axiosResp.data);
//   } else if (dataResp && dataResp.onError) {
//     dataResp.onError(axiosResp);
//   }

//   return axiosResp;
// };

// export { apiGet, apiPost, apiCall };

export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export type ApiFetchMethodEnum =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

class ApiCall {
  static async request(
    url: string,
    { method = 'GET', headers = {}, body = null, params = null } = {}
  ) {
    // Si hay params, construimos la URL con ellos
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    // Configuración de la solicitud
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: '',
    };

    // Si el cuerpo existe y no es un GET, lo serializamos a JSON
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      // Chequeo de status
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Intentar parsear como JSON
      const data = await response.json();
      return data;
    } catch (error) {
      // Manejo de errores
      console.error('Fetch error:', error);
      throw error;
    }
  }

  static get(url: string, config = {}) {
    return this.request(url, { ...config, method: 'GET' });
  }

  static post(url: string, body: any, config = {}) {
    return this.request(url, { ...config, method: 'POST', body });
  }

  static put(url: string, body: any, config = {}) {
    return this.request(url, { ...config, method: 'PUT', body });
  }

  static delete(url: string, config = {}) {
    return this.request(url, { ...config, method: 'DELETE' });
  }
}
