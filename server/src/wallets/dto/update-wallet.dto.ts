import { PickType } from '@nestjs/mapped-types';
import { IsBase64 } from 'class-validator';
import { CreateWalletDto } from './create-wallet.dto';

export class UpdateWalletDto extends PickType(CreateWalletDto, ['data']) {}
