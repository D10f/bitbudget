import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from '../expenses/expenses.service';
import { WalletsRepository } from './wallets.repository';
import { WalletsService } from './wallets.service';

describe('WalletsService', () => {
  let service: WalletsService;
  let repository;
  let expensesService;

  const mockWalletsRepository = () => ({
    create: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
    addExpenseDateToSchema: jest.fn(),
  });

  const mockExpensesService = () => ({
    removeExpenses: jest.fn(),
  });

  const mockWallet = {
    _id: '123',
    data: 'somebase64data',
    '1121': ['abc', 'def', 'ghi'],
    '0122': ['jkl'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        { provide: WalletsRepository, useFactory: mockWalletsRepository },
        { provide: ExpensesService, useFactory: mockExpensesService },
      ],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
    repository = module.get<WalletsRepository>(WalletsRepository);
    expensesService = module.get<ExpensesService>(ExpensesService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call repository to create a new wallet', () => {
      service.create({ _id: '123', data: 'someData' });
      expect(repository.create).toBeCalled();
    });

    it('should throw an error when wallet already exists', () => {
      repository.create.mockRejectedValueOnce({ message: 'E11000' });
      expect(
        service.create({ _id: '123', data: 'someData' }),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('findMany', () => {
    it('should return an array of wallets by ids', async () => {
      repository.findMany.mockResolvedValueOnce([mockWallet]);
      const result = await service.findMany(['1,2,3']);
      expect(result).toEqual([mockWallet]);
    });

    it('should return an empty array if no matches', async () => {
      repository.findMany.mockResolvedValueOnce([]);
      const result = await service.findMany(['1,2,3']);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should find one wallet by id', async () => {
      repository.findOne.mockResolvedValueOnce(mockWallet);
      expect(await service.findOne('123')).toEqual(mockWallet);
    });

    it('should throw an error if wallet was not found', () => {
      repository.findOne.mockResolvedValueOnce(null);
      expect(service.findOne('123')).rejects.toThrowError(NotFoundException);
    });

    it('should pass query options to repository call', async () => {
      repository.findOne.mockResolvedValueOnce(mockWallet);
      await service.findOne('123', { lean: true });
      expect(repository.findOne).toBeCalledWith('123', { lean: true });
    });
  });

  describe('update', () => {
    it('should call repository to update wallet', async () => {
      await service.update('123', { data: 'some data' });
      expect(repository.update).toBeCalled();
    });
  });

  describe('remove', () => {
    it('calls expense service and wallet repository to remove expenses and wallet', async () => {
      const spy = jest
        .spyOn(service, 'getExpensesInWallet')
        .mockResolvedValue(['abc', 'ghi', 'jkl']);

      await service.remove('123');
      expect(expensesService.removeExpenses).toBeCalledWith([
        'abc',
        'ghi',
        'jkl',
      ]);
      expect(repository.remove).toBeCalledWith('123');
    });

    it('throws an error if wallet id is not found', () => {
      repository.findOne.mockResolvedValue(null);
      expect(service.remove('123')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getExpensesInWallet', () => {
    it('retrieves all expenses inside a wallet document', async () => {
      repository.findOne.mockResolvedValueOnce(mockWallet);
      expect(await service.getExpensesInWallet('123')).toEqual([
        'abc',
        'def',
        'ghi',
        'jkl',
      ]);
    });

    it('throws an error if wallet id is not found', () => {
      repository.findOne.mockResolvedValue(null);
      expect(service.getExpensesInWallet('123')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('addExpenseToWallet', () => {
    const walletId = '123';
    const expenseId = 'mno';
    const walletUpdatedOne = {
      _id: '123',
      data: 'somebase64data',
      '1121': ['abc', 'def', 'ghi'],
      '0122': ['jkl'],
    };
    const walletUpdatedTwo = {
      _id: '123',
      data: 'somebase64data',
      '1121': ['abc', 'def', 'ghi'],
      '0122': ['jkl'],
    };

    it('should add expense id to wallet to existing range', async () => {
      repository.findOne.mockResolvedValueOnce(walletUpdatedOne);
      await service.addExpenseToWallet(walletId, expenseId, '0122');
      expect(repository.update).toBeCalled();
      expect(repository.addExpenseDateToSchema).not.toBeCalled();
      expect(walletUpdatedOne['0122']).toHaveLength(2);
    });

    it('should add expense id to wallet to non-existing range', async () => {
      repository.findOne.mockResolvedValueOnce(walletUpdatedTwo);
      await service.addExpenseToWallet(walletId, expenseId, '0421');
      expect(repository.update).toBeCalled();
      expect(repository.addExpenseDateToSchema).toBeCalledWith('0421');
      expect(walletUpdatedTwo).toHaveProperty('0421');
    });

    it('throws an error if wallet id is not found', () => {
      repository.findOne.mockResolvedValueOnce(null);
      expect(
        service.addExpenseToWallet(walletId, expenseId, '0121'),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('updateExpenseInWallet', () => {
    const walletId = '123';
    const expenseId = 'def';
    const expenseDate = '1121';
    const newExpenseDate = '0822';
    const walletUpdated = {
      _id: '123',
      data: 'somebase64data',
      '1121': ['abc', 'def', 'ghi'],
      '0122': ['jkl'],
    };

    it('should switch expense from wallet list of expenses', async () => {
      repository.findOne.mockResolvedValue(walletUpdated);
      await service.updateExpenseInWallet({
        walletId,
        expenseId,
        expenseDate,
        newExpenseDate,
      });
      expect(repository.update).toBeCalled();
      expect(repository.addExpenseDateToSchema).toBeCalledWith(newExpenseDate);
      expect(walletUpdated).toHaveProperty('0822');
      expect(walletUpdated['1121']).toHaveLength(2);
    });

    it('throws an error if wallet id is not found', () => {
      repository.findOne.mockResolvedValueOnce(null);
      expect(
        service.updateExpenseInWallet({
          walletId,
          expenseId,
          expenseDate,
          newExpenseDate,
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('removeExpenseFromWallet', () => {
    const walletId = '123';
    const expenseId = 'def';
    const expenseDate = '1121';
    const walletUpdated = {
      _id: '123',
      data: 'somebase64data',
      '1121': ['abc', 'def', 'ghi'],
      '0122': ['jkl'],
    };

    it('should remove an expense id from wallet', async () => {
      repository.findOne.mockResolvedValueOnce(walletUpdated);
      await service.removeExpenseFromWallet({
        walletId,
        expenseId,
        expenseDate,
      });
      expect(repository.update).toBeCalled();
      expect(walletUpdated['1121']).toHaveLength(2);
    });

    it('throws an error if wallet id is not found', () => {
      repository.findOne.mockResolvedValueOnce(null);
      expect(
        service.removeExpenseFromWallet({
          walletId,
          expenseId,
          expenseDate,
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
