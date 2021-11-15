import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SameUserGuard } from './guards/same-user.guard';
import { DeleteMongooseDocProps } from './decorators/DeleteMongooseDocProps.decorator';

// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  @UseGuards(SameUserGuard)
  @DeleteMongooseDocProps('_id', '__v', 'password')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(SameUserGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
