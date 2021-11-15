import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsBase64 } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['username']),
) {
  @IsString()
  @IsBase64()
  @IsOptional()
  data?: string;
}
