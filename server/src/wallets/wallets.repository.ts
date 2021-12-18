import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { IWalletUpdate } from './interfaces/wallet-update.interface';
import { Wallet, WalletDocument, WalletSchema } from './schema/wallet.schema';

@Injectable()
export class WalletsRepository {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  async create(createWalletDto: CreateWalletDto): Promise<WalletDocument> {
    try {
      return await this.walletModel.create({ ...createWalletDto, _id: createWalletDto.id });
    } catch (error) {
      console.log(error)
    }
  }

  async findMany(walletIds: string[]): Promise<WalletDocument[]> {
    return await this.walletModel.find({ _id: { $in: walletIds }}).lean();
  }

  async findOne(id: string, options?: QueryOptions): Promise<WalletDocument> {
    return await this.walletModel.findById(id, null, options);
  }

  async update(
    id: string,
    updates: UpdateWalletDto | IWalletUpdate,
  ): Promise<WalletDocument> {
    return await this.walletModel.findByIdAndUpdate(id, updates);
  }

  async remove(id: string): Promise<WalletDocument> {
    return await this.walletModel.findByIdAndDelete(id);
  }

  addExpenseDateToSchema(key: string) {
    WalletSchema.add({ [key]: [String] });
  }
}
