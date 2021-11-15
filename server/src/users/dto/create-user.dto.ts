import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
}
