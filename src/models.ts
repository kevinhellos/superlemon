export type AuthProviderType = "Google"| "Email" | "Hybrid";

export interface Chat {
  id: string;
  json: string;
  user_uid: string;
}

type HttpMethod = "GET" | "get" ; // Currently only supports GET method;

export interface HttpFetchConfig {
  url: string;
  method: HttpMethod;
  authorizationToken: string;
}