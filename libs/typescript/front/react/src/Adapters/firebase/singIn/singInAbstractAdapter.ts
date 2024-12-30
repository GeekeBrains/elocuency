export enum SingInProviderEnum {
  google = 'google',
  facebook = 'facebook',
}

export type SingInResponseType = {
  email: string;
  name?: string;
  avatarUrl?: string;
  providerId: string;
  providerType: SingInProviderEnum;
  providerToken: string;
} | null;

export type SingInAdapterType = () => Promise<SingInResponseType>;
