import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(jwtPayload: IJwtPayload): Promise<User> {
    const { username } = jwtPayload;
    const user = await this.userService.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Incorrect username/password');
    }

    return user;
  }

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthResponseDto> {
    const user = (await this.userService.createUser(
      authCredentialsDto,
    )) as UserDocument;

    const payload: IJwtPayload = {
      username: user.username,
      sub: user._id.toString(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthResponseDto> {
    const { username, password } = authCredentialsDto;
    const user = (await this.userService.findOne({ username })) as UserDocument;

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException('Incorrect username/password');
    }

    const payload: IJwtPayload = {
      username,
      sub: user._id.toString(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}