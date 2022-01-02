import { get, set, update, clear, del } from "idb-keyval";

class IndexDBStorage {
  /** Retrieves an item from the IndexedDB with the key provided */
  async getItem<T>(key: string) {
    return await get<T>(key);
  }

  /** Stores a value of any type to the IndexedDB using the key provided */
  async setItem<T>(key: string, value: T) {
    await set(key, value);
  }

  /** Deletes a particular key from the store */
  async clear(key: string) {
    await del(key);
  }
  
  /** Deletes all keys from the store */
  async clearAll() {
    await clear();
  }

  /** Retrieves all expenses for the current wallet and dates selected */
  async retrieveExpenses(wallet: IWallet, MMYY: string) {
    return await this.getItem(`expenses:${wallet.id}:${MMYY}`);
  }

  /** Saves the given expense to indexdb */
  async saveExpense(expense: IExpense, MMYY: string) {
    /* TODO: Find the root cause for the "out of memory" issue when using
     * formatDateAsMMY inside this function, as opposed to passing the
     * computed value...
     */
    // const dateMMYY = formatDateAsMMYY(expense.createdAt);

    const idbKey = `expenses:${expense.walletId}:${MMYY}`;
    await update<IExpense[]>(idbKey, (currentExpenses) => {
      return currentExpenses ? [...currentExpenses, expense] : [expense];
    });
  }

  /** Updates the given expense to indexdb */
  async updateExpense(expense: IExpense, MMYY: string) {
    const idbKey = `expenses:${expense.walletId}:${MMYY}`;
    await update<IExpense[]>(idbKey, (currentExpenses) =>
      currentExpenses!.map((exp) => (exp.id === expense.id ? expense : exp))
    );
  }
  
  /** Deletes the given expense to indexdb */
  async deleteExpense(expense: IExpense, MMYY: string) {
    const idbKey = `expenses:${expense.walletId}:${MMYY}`;
    await update<IExpense[]>(idbKey, (currentExpenses) =>
      currentExpenses!.filter((exp) => (exp.id !== expense.id))
    );
  }
}

export default new IndexDBStorage();
