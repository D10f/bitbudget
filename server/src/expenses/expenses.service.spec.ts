import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from 'src/users/users.repository';
import { ExpensesService } from './expenses.service';
import { ExpensesRepository } from './expenses.repository';

describe.skip('ExpensesService', () => {
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
        { provide: ExpensesRepository, useFactory: mockExpensesRepository },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    repository = module.get<ExpensesRepository>(ExpensesRepository);
  });

  describe.skip('create', () => {
    const mockCreateExpDto = {
      _id: 'abc',
      data: 'someData',
      walletId: '123',
      expenseDate: '1121',
    };
    it('should call repository to create a new expense', () => {
      service.create(mockCreateExpDto);
      expect(repository.create).toBeCalled();
    });

    it('should throw an error when expense already exists', () => {
      repository.create.mockRejectedValueOnce({ message: 'E11000' });
      expect(service.create(mockCreateExpDto)).rejects.toThrowError(
        ConflictException,
      );
    });
  });
});
