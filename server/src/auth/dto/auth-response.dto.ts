import { UserDocument } from "src/users/schemas/user.schema";

export class AuthResponseDto {
  accessToken: string;
  id?: string;
  userData?: string;
}
