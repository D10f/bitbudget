import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery, LeanDocument, QueryOptions } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<LeanDocument<User>> {
    try {
      return await this.usersRepository.createUser(createUserDto);
    } catch (error) {
      if (error.message.startsWith('E11000')) {
        throw new ConflictException('Username already exists');
      }
    }
  }

  findOne(filter: FilterQuery<UserDocument>, query?: QueryOptions): Promise<LeanDocument<User>> {
    return this.usersRepository.findOne(filter, query);
  }

  async getUserData(id: string): Promise<Buffer> {
    const user = await this.findOne({ id }, { data: 1 });
    return Buffer.from(user.data, 'base64');
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<LeanDocument<User>> {
    const user = await this.usersRepository.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('No user found with that id');
    }
    return user;
  }

  async storeSnapshot(id: string, data: Buffer): Promise<LeanDocument<User>> {
    return this.update(id, { data: data.toString('base64') });
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.delete(id);
    if (!user) {
      throw new NotFoundException('No user found with that id');
    }
  }
}
