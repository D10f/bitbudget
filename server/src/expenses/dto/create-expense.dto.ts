import { IsBase64, IsString, IsUUID } from 'class-validator';
import { IsMMYY } from '../validators/IsMMYY';

export class CreateExpenseDto {
  @IsUUID()
  _id: string;

  @IsBase64()
  data: string;

  @IsUUID()
  walletId: string;

  @IsMMYY()
  expenseDate: string;
}
