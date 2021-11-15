import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from 'src/users/users.repository';
import { ExpensesService } from './expenses.service';
import { ExpensesRepository } from './expenses.repository';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let repository;

  const mockExpensesRepository = () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: ExpensesRepository, useFactory: mockExpensesRepository }
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    repository = module.get<ExpensesRepository>(ExpensesRepository);
  });

  describe('create', () => {
    it('should call repository to create a new expense', () => {
      service.create({ _id: '123', data: 'someData' });
      expect(repository.create).toBeCalled();
    });

    it('should throw an error when expense already exists', () => {
      repository.create.mockRejectedValueOnce({ message: 'E11000' });
      expect(service.create({ _id: '123', data: 'someData' })).rejects.toThrowError(ConflictException);
    });
  });

});