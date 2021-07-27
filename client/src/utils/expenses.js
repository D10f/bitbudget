import numeral from 'numeral';
import moment from 'moment';
import makeGenerator from './makeGenerator';
import { selectCurrentWallet } from '../redux/wallets/selectors';
import { selectCurrentMMYY } from '../redux/filters/selectors';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./decrypt.worker.js';



/**
 * Converts an amount of money, in cents, into a formatted string as currency value
 * @param  {number} amount Some amount of money, in cents
 * @return {string}        String formatted as a currency value.
 */
export const formatAsCurrency = amount => numeral(amount / 100).format(`0,0.00`);



/**
 * Takes a date string and parses it to return the month and year for that date in MMYY format.
 * @param  {string} date A string representing a date (coming from a moment object)
 * @return {string}      A string representing the input date in MMYY format.
 */
export const parseDateIntoMMYY = date => {
  const month = moment(date).month().toString();
  const year = moment(date).year().toString();
  return `${month.padStart(2, '0')}` + `${year.slice(2)}`;
};



/**
 * Produces an string to be used as an key identifier based on current Redux state
 * @param  {object} state  The application's current state
 * @param  {string} prefix An arbitrary string to prefix the indexdb key
 * @return {string}        Formatted string used for indexdb
 */
export const generateIndexDBKey = (state, prefix) => {
  if (!prefix) {
    throw new Error('Prefix not provided!')
  }

  const { id } = selectCurrentWallet(state);
  const mmyy = selectCurrentMMYY(state);
  return `${prefix}:${id}:${mmyy}`;
};



/**
 * Performs a text-based search on an array of expenses. Initial character defines the field to run
 * a match for.
 * @param  {string} searchTerm  The search criteria
 * @param  {array}  expenseList Array of expenses to filter
 * @return {array}              A new array with the filtered expenses
 *
 * @example filterExpenses('coffe', expenseList)   // returns expenses with coffe in title or description
 * @example filterExpenses('/travel', expenseList) // returns expenses with category of travel
 * @example filterExpenses('@12', expenseList)     // returns expenses created on the 12th of the month
 * @example filterExpenses('@fri', expenseList)    // returns expenses created on a friday
 */
export const filterExpenses = (searchTerm, expenseList) => {
  // If there's no searching criteria return everything
  if (searchTerm === '') return expenseList;

  const lowerCaseTerm = searchTerm.toLowerCase();
  let filteredExpenses = [];

  // First character determines the field to look for a match
  switch (lowerCaseTerm[0]) {

    case '/': // search based on category
      return expenseList.filter(expense => (
        lowerCaseTerm.slice(1).includes(expense.category.toLowerCase())
      ));

    case '@': // search based on the day

      // Extract the relevant information (referencing the day) from the date string
      const validKeywordsRegExp = new RegExp(/^(\w{3})\s\w{3}\s(\d{2})/i);

      return expenseList.filter(expense => {
        const createdAtDay = expense.createdAt
          .toLowerCase()
          .match(validKeywordsRegExp)
          .slice(1);

        return createdAtDay.some(keyword => lowerCaseTerm.slice(1).startsWith(keyword));
      });

    default: // search based on title and description
      return expenseList.filter(expense => (
        expense.title.toLowerCase().includes(lowerCaseTerm.slice(1)) ||
        expense.description.toLowerCase().includes(lowerCaseTerm.slice(1))
      ));
  }
};


/**
 * Takes an array of expenses and decrypts them using Web Workers for parallel processing.
 * @param  {array}   dataset A collection of encrypted expenses
 * @return {Promise}         A promise that resolves to an array of JavaScript objects
 */
export const decryptExpensesWithWorkers = (dataset) => new Promise((resolve, reject) => {

  // Build a queue that returns the next expense in line, on demand
  const expenseQueue = makeGenerator(dataset);

  // Use 4 Web Workers at most, each will decrypt an expense at the time from the queue.
  const logicalCores = Math.min(navigator.hardwareConcurrency || 4, 4);

  const decryptedExpenses = []; // The end result will be stored here
  const workersDone = [];       // Keep track of workers marked for deletion

  for (let core = 0; core < logicalCores; core++) {

    // The Worker file already contains the necesary logic to decrypt an expense
    const worker = new Worker();

    worker.addEventListener('message', message => {

      // The worker returns the fully decrypted expense object
      const expense = message.data;
      decryptedExpenses.push(expense);

      const { value, done } = expenseQueue.next();

      if (done) {
        // If there are no more expenses, mark this worker for deletion.
        workersDone.push(worker);

        if (workersDone.length === logicalCores) {
          // Eventually all workers will be marked for deletion, when that happens delete them and
          // resolve the promise with the decrypted expenses
          workersDone.forEach(worker => worker.terminate());
          resolve(decryptedExpenses);
        }

      } else {
        // If not done, then send the next expense in queue for decryption
        worker.postMessage(value);
      }
    });

    // Here is the first postMessage call will trigger subsequent postMessages calls recursively.
    const { value, done } = expenseQueue.next();

    // There may not be any expenses to decrypt for a given time period
    if (done) {
      worker.terminate();
      resolve(decryptedExpenses);
      break;
    }

    worker.postMessage(value);
  }
});
