import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletDocument } from './schema/wallet.schema';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto): Promise<WalletDocument> {
    return this.walletsService.create(createWalletDto);
  }

  @Get()
  findMany(@Query('q') ids: string): Promise<WalletDocument[]> {
    const walletIds: string[] = ids.split(',');
    return this.walletsService.findMany(walletIds);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<WalletDocument> {
    return this.walletsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto): Promise<WalletDocument> {
    return this.walletsService.update(id, updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<WalletDocument> {
    return this.walletsService.remove(id);
  }
}
