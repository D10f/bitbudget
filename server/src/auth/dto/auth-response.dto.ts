export class AuthResponseDto {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  userData?: string;
  defaultWalletId?: string;
}
