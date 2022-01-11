import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponseDto } from './dto/auth-response.dto';
import { randomUUID } from 'crypto';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private walletService: WalletsService,
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
    try {
      const user = (await this.userService.createUser(
      authCredentialsDto,
    )) as UserDocument;

    const payload: IJwtPayload = {
      username: user.username,
      sub: user._id.toString(),
    };

    // create user's first wallet by default
    const walletId = randomUUID();
    await this.walletService.create({ id: walletId });

    return {
      id: user._id,
      username: user.username,
      email: user.email || "",
      accessToken: this.jwtService.sign(payload),
      defaultWalletId: walletId,
    };
    } catch (error) {
      throw new Error(error);
    }
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
      id: user._id.toString(),
      username: user.username,
      email: user.email || "",
      accessToken: this.jwtService.sign(payload),
    };
  }
}
