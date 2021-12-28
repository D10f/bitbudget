import { get, set, del } from 'idb-keyval';

class IndexDBStorage {

  /** Retrieves an item from the IndexedDB with the key provided */
  async getItem(key: string) {
    return await get(key);
  }

  /** Stores a value of any type to the IndexedDB using the key provided */
  async setItem(key: string, value: any) {
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
}

export default new IndexDBStorage();