import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryOptions } from 'mongoose';
import { WalletsService } from 'src/wallets/wallets.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesRepository } from './expenses.repository';
import { ExpenseDocument } from './schema/expense.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @Inject(forwardRef(() => WalletsService))
    private readonly walletsService: WalletsService,
    private readonly expensesRepository: ExpensesRepository,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<ExpenseDocument> {
    const { _id, data, walletId, expenseDate } = createExpenseDto;
    try {
      await this.walletsService.addExpenseToWallet(walletId, _id, expenseDate);
      const expense = await this.expensesRepository.create({
        _id,
        data,
        walletId
      });
      return expense;
    } catch (error) {
      if (error.message.startsWith('E11000')) {
        throw new ConflictException('An expense with that id already exists.');
      }
      throw error;
    }
  }

  findAll(): Promise<ExpenseDocument[]> {
    return this.expensesRepository.findAll();
  }

  async findOne(id: string, options?: QueryOptions): Promise<ExpenseDocument> {
    const expense = await this.expensesRepository.findOne(id, options);
    if (!expense) {
      throw new NotFoundException('No expense with that id was found.');
    }
    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpenseDocument | void> {
    const { data, expenseDate, newExpenseDate } = updateExpenseDto;

    if (!data && !expenseDate) {
      throw new BadRequestException(
        'Invalid or insufficient information provided to update the expense.',
      );
    }

    const expense = await this.findOne(id, { lean: true });

    if (expenseDate && newExpenseDate && expenseDate !== newExpenseDate) {
      this.walletsService.updateExpenseInWallet({
        walletId: expense.walletId,
        expenseId: id,
        expenseDate: expenseDate,
        newExpenseDate,
      });
    }

    if (data) {
      return await this.expensesRepository.update(id, { data });
    }
  }

  async remove(id: string, expenseDate: string): Promise<ExpenseDocument> {
    const expense = await this.findOne(id, { lean: true });

    await this.walletsService.removeExpenseFromWallet({
      expenseId: id,
      expenseDate,
      walletId: expense.walletId,
    });

    return this.expensesRepository.remove(id);
  }

  removeExpenses(expenseIds: string[]): Promise<void> {
    return this.expensesRepository.removeExpenses(expenseIds);
  }
}
