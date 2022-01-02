import { get, set, update, del } from "idb-keyval";

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
    console.log(MMYY)
    await update<IExpense[]>(idbKey, (currentExpenses) => {
      return currentExpenses
        ? [ ...currentExpenses, expense ]
        : [ expense ];
    });
  }
}

export default new IndexDBStorage();
