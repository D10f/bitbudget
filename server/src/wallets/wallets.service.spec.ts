import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from 'src/users/users.repository';
import { WalletsRepository } from './wallets.repository';
import { WalletsService } from './wallets.service';

describe('WalletsService', () => {
  let service: WalletsService;
  let repository;

  const mockWalletsRepository = () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        { provide: WalletsRepository, useFactory: mockWalletsRepository }
      ],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
    repository = module.get<WalletsRepository>(WalletsRepository);
  });

  describe('create', () => {
    it('should call repository to create a new wallet', () => {
      service.create({ _id: '123', data: 'someData' });
      expect(repository.create).toBeCalled();
    });

    it('should throw an error when wallet already exists', () => {
      repository.create.mockRejectedValueOnce({ message: 'E11000' });
      expect(service.create({ _id: '123', data: 'someData' })).rejects.toThrowError(ConflictException);
    });
  });

});