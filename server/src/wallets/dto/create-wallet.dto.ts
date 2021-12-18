import { IsBase64, IsUUID } from "class-validator";

export class CreateWalletDto {
  @IsUUID()
  id: string;

  // @IsBase64()
  // data: string;
}
