import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { FilterQuery, LeanDocument, Model, QueryOptions } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(
    userFilterQuery: FilterQuery<UserDocument>,
    userQueryOptions?: QueryOptions,
  ): Promise<LeanDocument<User>> {
    return await this.userModel.findOne(userFilterQuery, userQueryOptions).lean();
  }

  async find(
    userFilterQuery: FilterQuery<UserDocument>,
  ): Promise<LeanDocument<User>[]> {
    return await this.userModel.find(userFilterQuery).lean();
  }

  async createUser(createUserDto: CreateUserDto): Promise<LeanDocument<User>> {
    const hashedPassword = await argon2.hash(createUserDto.password);
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.toObject();
  }

  async update(id: string, user: Partial<User>): Promise<LeanDocument<User>> {
    if (user.password) {
      user.password = await argon2.hash(user.password);
    }
    return await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .lean();
  }

  async delete(id: string): Promise<LeanDocument<User>> {
    return await this.userModel.findByIdAndDelete(id).lean();
  }
}
