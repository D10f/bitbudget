import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { IExpenseUpdate } from './interfaces/expense-update.interface';
import { Expense, ExpenseDocument } from './schema/expense.schema';

@Injectable()
export class ExpensesRepository {
  constructor(
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<ExpenseDocument>,
  ) {}

  async create(expense: Expense): Promise<ExpenseDocument> {
    return await this.expenseModel.create(expense);
  }

  async findOne(id: string, options?: QueryOptions): Promise<ExpenseDocument> {
    return await this.expenseModel.findById(id, null, options);
  }

  async findMany(ids: string[], options?: QueryOptions): Promise<ExpenseDocument[]> {
    return await this.expenseModel.find({ _id: { $in: ids }});
  }

  async update(id: string, updates: IExpenseUpdate): Promise<ExpenseDocument> {
    return await this.expenseModel.findByIdAndUpdate(id, updates);
  }

  async remove(id: string): Promise<ExpenseDocument> {
    return await this.expenseModel.findByIdAndDelete(id);
  }

  async removeExpenses(expenseIds: string[]): Promise<{ deletedCount: number }> {
    const result = await this.expenseModel.deleteMany({ _id: { $in: expenseIds }});
    return result;
  }
}
