import moment from "moment";
import { makeGenerator } from "./makeGenerator";
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./decrypt.worker";

/**
 * Formats a Date string into month/date (MMYY) e.g., 0521, 1021, 0122
 */
export const formatDateAsMMYY = (date: string) => {
  const momentObj = moment(date);
  const month = momentObj.month().toString().padStart(2, "0");
  const year = momentObj.year().toString().slice(2);
  return `${month}${year}`;
};

/**
 * Receives a list of expenses to decrypt, using workers for parallel processing
 */
export const decryptExpensesWithWorkers = (
  expenses: IEncryptedExpense[]
): Promise<IExpense[]> =>
  new Promise((resolve, reject) => {
    // Create a generator to allow workers to decrypt expenses on demand
    const expenseQueue = makeGenerator<IEncryptedExpense>(expenses);

    // Determine how many workers to spawn based on hardware and dataset size
    const logicalCores = Math.min(
      navigator.hardwareConcurrency || 4,
      expenses.length
    );

    const decryptedExpenses: IExpense[] = [];
    const workersDone: Worker[] = [];

    for (let _core = 0; _core < logicalCores; _core++) {
      const worker = new Worker();

      worker.addEventListener("message", (message: MessageEvent<IExpense>) => {
        const expense = message.data;
        decryptedExpenses.push(expense);

        const { value, done } = expenseQueue.next();

        if (done) {
          workersDone.push(worker);

          if (workersDone.length === logicalCores) {
            workersDone.forEach((worker) => worker.terminate());
            resolve(decryptedExpenses);
            return;
          }
        }

        worker.postMessage(value);
      });

      const { value, done } = expenseQueue.next();

      // Prevent spawining more workers than are actually required when there are only a few expenses to decrypt
      if (done) {
        worker.terminate();
        resolve(decryptedExpenses);
        break;
      }

      // Starts the decryption process
      worker.postMessage(value);
    }
  });
