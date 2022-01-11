import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { ExpensesRepository } from './expenses.repository';
import { WalletsService } from '../wallets/wallets.service';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let repository;
  let walletsService;

  const mockExpensesRepository = () => ({
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeExpenses: jest.fn(),
  });

  const mockWalletsService = () => ({
    addExpenseToWallet: jest.fn(),
    updateExpenseInWallet: jest.fn(),
    removeExpenseFromWallet: jest.fn(),
  });

  const mockExpense = {
    _id: 'abc',
    data: 'someData',
    walletId: '123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: ExpensesRepository, useFactory: mockExpensesRepository },
        { provide: WalletsService, useFactory: mockWalletsService },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    repository = module.get<ExpensesRepository>(ExpensesRepository);
    walletsService = module.get<WalletsService>(WalletsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockCreateExpDto = {
      _id: 'abc',
      data: 'someData',
      walletId: '123',
      expenseDate: '1121',
    };

    it('should call repository and wallet service to create a new expense', async () => {
      await service.create(mockCreateExpDto);
      expect(repository.create).toBeCalled();
      expect(walletsService.addExpenseToWallet).toBeCalled();
    });

    it('should throw an error when expense already exists', async () => {
      repository.create.mockRejectedValueOnce({ message: 'E11000' });
      expect(service.create(mockCreateExpDto)).rejects.toThrowError(
        ConflictException,
      );
    });

    it('should throw an error when wallet does not exist', () => {
      walletsService.addExpenseToWallet.mockRejectedValueOnce({ message: 'wallet does not exist' });
      // expect(service.create(mockCreateExpDto)).rejects.toThrow();
      service.create(mockCreateExpDto).catch(error => {
        expect(error.message).toBe('wallet does not exist');
      });
    });
  });

  describe('findOne', () => {
    it('should return one expense', async () => {
      repository.findOne.mockResolvedValueOnce(mockExpense);
      expect(await service.findOne('abc')).toEqual(mockExpense);
    });

    it('should throw an error if expense not found', () => {
      repository.findOne.mockResolvedValueOnce(null);
      expect(service.findOne('abc')).rejects.toThrowError(NotFoundException);
    });

    it('should call findone in repo with options', async () => {
      repository.findOne.mockResolvedValueOnce(mockExpense);
      await service.findOne('123', { lean: true });
      expect(repository.findOne).toBeCalledWith('123', { lean: true });
    });
  });

  describe('update', () => {
    it('should call both repo and wallet service to update an expense', async () => {
      const mockUpdateExpenseDto = {
        data: 'new data',
        expenseDate: '1222',
        newExpenseDate: '0123',
      };
      repository.findOne.mockResolvedValueOnce(mockExpense);
      await service.update('abc', mockUpdateExpenseDto);
      expect(walletsService.updateExpenseInWallet).toBeCalled();
      expect(repository.update).toBeCalled();
    });

    it('should only call repo to update an expense', async () => {
      const mockUpdateExpenseDto = {
        data: 'new data'
      };
      repository.findOne.mockResolvedValueOnce(mockExpense);
      await service.update('abc', mockUpdateExpenseDto);
      expect(walletsService.updateExpenseInWallet).not.toBeCalled();
      expect(repository.update).toBeCalled();
    });

    it('should only call wallet service to update an expense', async () => {
      const mockUpdateExpenseDto = {
        expenseDate: '1234',
        newExpenseDate: '1122'
      };
      repository.findOne.mockResolvedValueOnce(mockExpense);
      await service.update('abc', mockUpdateExpenseDto);
      expect(walletsService.updateExpenseInWallet).toBeCalled();
      expect(repository.update).not.toBeCalled();
    });

    it('should not call wallet service if current and new expense date match', async () => {
      const mockUpdateExpenseDto = {
        expenseDate: '1234',
        newExpenseDate: '1234'
      };
      repository.findOne.mockResolvedValueOnce(mockExpense);
      await service.update('abc', mockUpdateExpenseDto);
      expect(walletsService.updateExpenseInWallet).not.toBeCalled();
      expect(repository.update).not.toBeCalled();
    })

    it('should throw error if both data and expenseDate are missing', () => {
      expect(service.update('123', {})).rejects.toThrowError(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should call wallet service and repo to remove an expense', async () => {
      repository.findOne.mockResolvedValueOnce(mockExpense);
      await service.remove('abc', '1234');
      expect(walletsService.removeExpenseFromWallet).toBeCalled();
      expect(repository.remove).toBeCalled();
    });

    it('should throw an error if no expense is found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      expect(service.remove('abc', '1234')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('removeExpenses', () => {
    it('should call repo to remove many expenses by id', async () => {
      await service.removeExpenses(['abc']);
      expect(repository.removeExpenses).toBeCalled();
    });
  });
});
