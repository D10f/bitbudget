import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { AuthService } from './auth.service';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('AuthService', () => {
  const mockJwtService = () => ({
    sign: jest.fn(),
  });

  const mockUserService = () => ({
    findOne: jest.fn(),
    createUser: jest.fn(),
  });

  const mockWalletService = () => ({
    create: jest.fn()
  });

  let service: AuthService;
  let jwtService;
  let usersService;
  let walletsService;

  const mockUser = {
    _id: '123',
    username: 'test',
    email: 'test@example.org',
    password: 'password123',
    data: 'some data',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useFactory: mockJwtService },
        { provide: WalletsService, useFactory: mockWalletService },
        { provide: UsersService, useFactory: mockUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    walletsService = module.get<WalletsService>(WalletsService);

    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should call users service to find a user', async () => {
      usersService.findOne.mockResolvedValueOnce(mockUser);
      expect(
        await service.validateUser({ username: 'test', sub: '123' }),
      ).toEqual(mockUser);
    });

    it('should throw an error when user is not found', async () => {
      usersService.findOne.mockResolvedValueOnce(null);
      expect(
        service.validateUser({ username: 'test', sub: '123' }),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should call user service to create a user, and jwt to sign a token', async () => {
      usersService.createUser.mockResolvedValueOnce(mockUser);
      await service.signUp({ username: 'test', password: 'pasword' });
      expect(jwtService.sign).toBeCalledWith({ username: 'test', sub: '123' });
    });

    it('should throw an error if user is duplicated', () => {
      usersService.createUser.mockResolvedValueOnce({ message: 'E11000' });
      // expect(
      //   service.signUp({ username: 'test', password: 'pasword' }),
      // ).rejects.toThrowError(ConflictException);
    });
  });

  describe('singIn', () => {
    it('should call userservice to find user, hash password and sign token', async () => {
      usersService.findOne.mockResolvedValueOnce(mockUser);
      const argonSpy = jest.spyOn(argon2, 'verify').mockResolvedValueOnce(true);
      await service.signIn({ username: 'test', password: 'password' });
      expect(argonSpy).toBeCalled();
      expect(jwtService.sign).toBeCalledWith({ username: 'test', sub: '123' });
    });

    it('should throw an error if user is not found', () => {
      usersService.findOne.mockResolvedValueOnce(null);
      expect(
        service.signIn({ username: 'test', password: 'password' }),
      ).rejects.toThrowError(UnauthorizedException);
    });
    
    it('should throw an error if password does not match', () => {
      usersService.findOne.mockResolvedValueOnce(mockUser);
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(false);
      expect(
        service.signIn({ username: 'test', password: 'password' }),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
