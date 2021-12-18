import { CreateWalletDto } from './create-wallet.dto';

// export class UpdateWalletDto extends PickType(CreateWalletDto, ['data']) {}
export class UpdateWalletDto extends CreateWalletDto {}
