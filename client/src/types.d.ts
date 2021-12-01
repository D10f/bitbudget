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