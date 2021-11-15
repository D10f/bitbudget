import { PickType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { IsMMYY } from '../validators/IsMMYY';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(
  PickType(CreateExpenseDto, ['data', 'expenseDate']),
) {
  @IsMMYY()
  @IsOptional()
  newExpenseDate?: string;
}
