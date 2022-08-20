import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SameUserGuard } from './guards/same-user.guard';
import { DeleteMongooseDocProps } from './decorators/DeleteMongooseDocProps.decorator';
import { Response } from 'express';

// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':id')
  @UseGuards(SameUserGuard)
  async getUserData(
    @Param('id') id: string,
    @Res({ passthrough: false }) res: Response,
  ) {
    const data = await this.usersService.getUserData(id);
    console.log(data);
    return res.send(data);
  }

  @Patch(':id')
  @UseGuards(SameUserGuard)
  @DeleteMongooseDocProps('_id', '__v', 'password')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('/snapshot/:id')
  @UseGuards(SameUserGuard)
  snapshot(@Param('id') id: string, @Body() data: Buffer): Promise<User> {
    return this.usersService.storeSnapshot(id, data);
  }

  @Delete(':id')
  @UseGuards(SameUserGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
