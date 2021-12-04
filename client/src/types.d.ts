interface IUser {
  username: string;
  isAuthenticated: boolean;
  data: any;
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