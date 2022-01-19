import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UserService', () => {
  const mockUsersRepository = () => ({
    createUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  const mockUser = {
    username: 'some user',
    password: 'P4s$word!',
    email: 'username@example.com',
  };

  let usersService;
  let usersRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
      ],
    }).compile();

    usersService = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  describe('This will fail', () => {
    it('should fail', () => {
      expect(1).toBe(2);
    });
  });

  describe('create', () => {
    it('should call repository to create a user', async () => {
      await usersService.createUser(mockUser);
      expect(usersRepository.createUser).toBeCalledWith(mockUser);
    });

    it('should throw an error if username is taken', () => {
      usersRepository.createUser.mockRejectedValueOnce({
        message: 'E11000',
      });

      expect(usersService.createUser(mockUser)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should call repository to find a user', async () => {
      await usersService.findOne({ _id: '123' });
      expect(usersRepository.findOne).toBeCalled();
    });
  });

  describe('update', () => {
    it('should call repository to update a user', async () => {
      usersRepository.update.mockResolvedValueOnce(mockUser);
      await usersService.update('123', { password: 'newpass' });
      expect(usersRepository.update).toBeCalledWith('123', {
        password: 'newpass',
      });
    });

    it('should throw an error if user not found', async () => {
      usersRepository.update.mockResolvedValueOnce(null);
      expect(
        usersService.update('123', { password: 'newpass' }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call repository to remove a user', async () => {
      usersRepository.delete.mockResolvedValueOnce(mockUser);
      await usersService.remove('123');
      expect(usersRepository.delete).toBeCalledWith('123');
    });

    it('should throw an error for user not found', async () => {
      usersRepository.delete.mockResolvedValueOnce(null);
      expect(usersService.remove('123')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
