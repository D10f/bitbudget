interface IUser {
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