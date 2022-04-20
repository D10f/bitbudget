interface IUser {
  id: string;
  username: string;
  email?: string;
}

interface IWallet {
  id: string;
  name: string;
  budget: string;
  currency: string;
  isCurrent: boolean;
}

interface IExpense {
  id: string;
  title: string;
  amount: string;
  category: string;
  description: string;
  createdAt: string;
  walletId: string;
}

interface IEncryptedExpense {
  _id: string;
  data: string;
  walletId: string;
}

interface INotification {
  id: string;
  msg: string;
  type: string;
  duration: number;
}

interface AuthUserPDO {
  username: string;
  password: string;
  email?: string;
}

interface AddWalletPDO {
  name: string;
  budget: string;
  currency: string;
  isCurrent: boolean;
}

enum Currencies {
  EUR,
  USD,
  GBP,
  AUD,
  SGP,
  JPY,
  CNY,
  INR,
};

export enum Breakpoints {
  XS = "25em",
  PHONE = "37.5em",
  TABLET_PORTRAIT = "48em",
  TABLET_LANDSCAPE = "75em",
  DESKTOP = "112.5em",
  WIDESCREEN = "112.5em",
};