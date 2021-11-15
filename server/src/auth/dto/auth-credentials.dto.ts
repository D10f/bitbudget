import { OmitType } from "@nestjs/mapped-types";
import { CreateUserDto } from "../../users/dto/create-user.dto";

export class AuthCredentialsDto extends OmitType(CreateUserDto, ['email']) {}
