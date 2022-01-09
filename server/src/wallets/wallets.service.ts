import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeanDocument, QueryOptions } from 'mongoose';
import { ExpenseDocument } from 'src/expenses/schema/expense.schema';
import { ExpensesService } from '../expenses/expenses.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { IExpenseDateUpdate } from './interfaces/expense-date-update.interface';
import { IExpenseRemove } from './interfaces/expense-remove.interface';
import { WalletDocument } from './schema/wallet.schema';
import { WalletsRepository } from './wallets.repository';

@Injectable()
export class WalletsService {
  constructor(
    @Inject(forwardRef(() => ExpensesService))
    private readonly expensesService: ExpensesService,
    private readonly walletsRepository: WalletsRepository,
  ) {}

  async create(createWalletDto: CreateWalletDto): Promise<WalletDocument> {
    try {
      return await this.walletsRepository.create(createWalletDto);
    } catch (error) {
      if (error.message.startsWith('E11000')) {
        throw new ConflictException('Wallet with that id already exists.');
      }
    }
  }

  findMany(walletIds: string[]): Promise<WalletDocument[]> {
    return this.walletsRepository.findMany(walletIds);
  }

  async findOne(id: string, options?: QueryOptions): Promise<WalletDocument> {
    const wallet = await this.walletsRepository.findOne(id, options);
    if (!wallet) {
      throw new NotFoundException('Wallet with that id was not found.');
    }
    return wallet;
  }

  update(
    id: string,
    updateWalletDto: UpdateWalletDto,
  ): Promise<WalletDocument> {
    return this.walletsRepository.update(id, updateWalletDto);
  }

  async remove(id: string): Promise<WalletDocument> {
    const expensesInWallet: string[] = await this.getExpensesInWallet(id);
    await this.expensesService.removeExpenses(expensesInWallet);
    return this.walletsRepository.remove(id);
  }

  async findExpenses(walletId: string, mmyy: string): Promise<ExpenseDocument[]> {
    const wallet = await this.findOne(walletId, { lean: true });
    const expenses = await this.expensesService.findMany(wallet[mmyy]);
    console.log(expenses);
    return expenses;
  }

  getExpensesInWallet(walletId: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const wallet: LeanDocument<WalletDocument> = await this.findOne(
          walletId,
          { lean: true },
        );
        const expenses: string[] = [];

        let key: string;
        for (key in wallet) {
          if (key === '_id' || key === '__v' || key === 'data') {
            continue;
          }
          if (wallet[key].length) {
            expenses.push(wallet[key]);
          }
        }

        resolve(expenses.flat());
      } catch (error) {
        reject(error);
      }
    });
  }

  async addExpenseToWallet(
    walletId: string,
    expenseId: string,
    expenseDate: string,
  ): Promise<void> {
    const wallet: LeanDocument<WalletDocument> = await this.findOne(walletId, {
      lean: true,
    });

    if (!wallet[expenseDate]) {
      this.walletsRepository.addExpenseDateToSchema(expenseDate);
      wallet[expenseDate] = [expenseId];
    } else {
      wallet[expenseDate] = [...wallet[expenseDate], expenseId];
    }

    await this.walletsRepository.update(walletId, wallet);
  }

  async updateExpenseInWallet(props: IExpenseDateUpdate): Promise<void> {
    const { walletId, expenseId, expenseDate, newExpenseDate } = props;

    const wallet: LeanDocument<WalletDocument> = await this.findOne(walletId, {
      lean: true,
    });

    wallet[expenseDate] = wallet[expenseDate].filter(
      (id: string) => id !== expenseId,
    );

    if (!wallet[newExpenseDate]) {
      this.walletsRepository.addExpenseDateToSchema(newExpenseDate);
      wallet[newExpenseDate] = [expenseId];
    } else {
      wallet[newExpenseDate] = [...wallet[newExpenseDate], expenseId];
    }

    await this.walletsRepository.update(walletId, wallet);
  }

  async removeExpenseFromWallet(props: IExpenseRemove): Promise<void> {
    const { expenseId, expenseDate, walletId } = props;

    const wallet: LeanDocument<WalletDocument> = await this.findOne(walletId, {
      lean: true,
    });

    wallet[expenseDate] = wallet[expenseDate].filter(
      (id: string) => id !== expenseId,
    );

    await this.walletsRepository.update(walletId, wallet);
  }
}
