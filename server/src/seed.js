const { webcrypto } = require('crypto');
const fs = require('fs').promises;
const { MongoClient } = require('mongodb');
const moment = require('moment');
const axios = require('axios');
const minifaker = require('minifaker');
require('minifaker/locales/en');

const IS_PROD = process.env.NODE_ENV === 'production';

const WALLET_ONE_ID = '6021bfe0-22cc-4d7a-b975-dbe6ab851ea6';
const WALLET_TWO_ID = 'eed1d12b-8925-40f2-87d9-663ad96f69ae';

const TOTAL_EXPENSES = 100;

const CATEGORIES = [
  "Travel",
  "Food",
  "Electronics",
  "Entertainment",
  "Groceries",
  "Gifts",
  "Drinks",
  "Tickets",
  "Sports",
  "Education",
];

const CURRENCIES = [
  "EUR",
  "USD",
  "GBP",
  "AUD",
  "SGP",
  "JPY",
  "CNY",
  "INR",
];

const WALLET_NAMES = [
  'Trip To Thailand',
  'Trip To Iceland',
  'Trip To Guatemala',
  'Holiday 2022',
  'Business Trip',
  'Road Trip 2022',
];

const fakeUser = {
  username: 'Luigi',
  password: 'iamnotmario'
};

let cryptoKey = null;


async function main() {

  /**
   *  Create DB connection
   */

  const { name, user, pass } = await getDBCredentials();
  const uri = `mongodb://${user}:${pass}@mongo:27017/${name}?authSource=admin`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true
  });

  try {

    await client.connect();

    const users = client.db(name).collection('users');

    /**
     *  Create an axios instance to make HTTP requests against the server
     */

    const api = axios.create({
      baseURL: IS_PROD ? 'http://localhost:80' : 'http://localhost:5000',
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    api.interceptors.request.use(function(config) {
      config.headers.Authorization = `Bearer ${fakeUser.token}`;
      return config;
    });

    /**
     *  Generate a new cryptographic key
     */

    cryptoKey = await generateCryptoKey();

    /**
     *  Delete fake user, and recreate it
     */

    await users.deleteOne({ username: fakeUser.username });
    const response = await api.post('/auth/signup', fakeUser);
    fakeUser.token = response.data.accessToken;

    /**
     *  Delete fake user data
     */

    try {
      await api.delete(`/wallets/${response.data.defaultWalletId}`);
      await api.delete(`/wallets/${WALLET_ONE_ID}`);
      await api.delete(`/wallets/${WALLET_TWO_ID}`);
    } catch (err) {
      console.log(`${err.name}: ${err.message}`);
      console.log(`${err.response.data.message}`);
      console.log('Moving on...');
    }

    /**
     * Create two new wallets 
     */

    const walletOne = {
      id: WALLET_ONE_ID,
      name: minifaker.arrayElement(WALLET_NAMES),
      budget: minifaker.number({ min: 1000, max: 5000 }),
      currency: minifaker.arrayElement(CURRENCIES),
      isCurrent: true,
    };

    const walletTwo = {
      id: WALLET_TWO_ID,
      name: minifaker.arrayElement(WALLET_NAMES),
      budget: minifaker.number({ min: 1000, max: 5000 }),
      currency: minifaker.arrayElement(CURRENCIES),
      isCurrent: false,
    };

    await api.post('/wallets', walletOne);
    await api.post('/wallets', walletTwo);

    /**
     *  Update user's encrypted data for use in frontend
     */

    const userData = {
      wallets: [walletOne, walletTwo],
      categories: CATEGORIES
    };

    const userDataBuffer = await objectToBuffer(userData);
    const userDataEncrypted = await encryptData(userDataBuffer);

    await api.patch(
      `/users/snapshot/${response.data.id}`,
      userDataEncrypted,
      {
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      }
    );

    /**
     *  Create a set of expenses for each wallet
     */

    const fakeExpenseList = [];

    for (let i = 0; i < TOTAL_EXPENSES; i++) {
      fakeExpenseList.push(
        api.post('/expenses', await createExpense())
      );
    }

    await Promise.all(fakeExpenseList);

  } catch (err) {

    console.log(`${err.name}: ${err.message}`);
    console.log(err.cause);
    console.log(err.stack);
    if (err.response) {
      console.log(`${err.response.data.message}`);
    }

  } finally {

    client.close();

  }
};

/**
 *  Creates an encrypted expense using random fake data
 */
async function createExpense() {

  /* Pick a random month, plus or minus one, from the current date */
  const m = moment(Date.now());
  // const date = m.date();
  const year = m.year();
  const month = minifaker.number({
    min: m.month() - 2,
    max: m.month() + 2
  });

  /* Pick a random date */
  const date = minifaker.number({ min: 1, max: 28 });

  const expenseDate = new Date(`${year}-${month}-${date}`);

  /* Fill expense using random data */
  const data = {
    title: getWords(2, 5),
    description: getWords(4, 8),
    amount: minifaker.number({ min: -100, max: 500, float: minifaker.boolean() }).toFixed(2),
    category: minifaker.arrayElement(CATEGORIES),
    createdAt: moment(expenseDate).toString()
  };

  /* Encrypt expense data and return wrapper */
  const dataBuffer = await objectToBuffer(data);
  const encryptedData = await encryptData(dataBuffer);

  return {
    _id: minifaker.uuid.v4(),
    data: Buffer.from(encryptedData.toString()).toString('base64'),
    walletId: minifaker.arrayElement([WALLET_ONE_ID, WALLET_TWO_ID]),
    expenseDate: formatDateAsMMYY(expenseDate)
  };
}

/**
 *  Produces a string of random words, but slightly more meaninful than fully randomized
 */
function getWords(min, max) {
  let res = '';

  for (let i = min; i <= max; i++) {

    if (i < max) {
      res += minifaker.word({ type: minifaker.arrayElement(['preposition', 'adjective', 'adverb', 'conjunction']) });
      res += ' ';
    } else {
      res += minifaker.word({ type: minifaker.arrayElement(['verb', 'noun']) });
    }
  }

  return res;
}

/**
 *  Produces a formatted string using a date object as input
 */
function formatDateAsMMYY(date) {
  const momentObj = moment(date);
  const month = (momentObj.month() + 1).toString().padStart(2, '0');
  const year = momentObj.year().toString().slice(2);
  return `${month}${year}`;
}

/**
 *  Converts a JS object into a buffer
 */
async function objectToBuffer(obj) {
  return Buffer.from(JSON.stringify(obj));
}

/**
 *  Creates cryptographic material based off user's password 
 */
async function generateCryptoKey() {
  return await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(fakeUser.password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
}

/**
 *  Derives a cryptographic key to be used for encryption/decryption
 */
async function deriveKey(salt = webcrypto.getRandomValues(new Uint8Array(32))) {
  const key = await webcrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 250_000,
      hash: 'SHA-256',
    },
    cryptoKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return { key, salt };
}

/**
 *  Encrypts a piece of data
 */
async function encryptData(data) {
  const iv = webcrypto.getRandomValues(new Uint8Array(16));
  const { key, salt } = await deriveKey();

  const encryptedBuffer = await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return new Uint8Array([...salt, ...iv, ...new Uint8Array(encryptedBuffer)]);
}

/**
 *  Decrypts a piece of data
 */
// async function decryptData(encryptedBuffer) {
//   const encryptedBytes = new Uint8Array(encryptedBuffer);
//   const salt = encryptedBytes.slice(0, 32);
//   const iv = encryptedBytes.slice(32, 32 + 16);
//   const data = encryptedBytes.slice(32 + 16);

//   const { key } = await deriveKey(salt);

//   return await webcrypto.subtle.decrypt(
//     { name: 'AES-GCM', iv },
//     key,
//     data
//   );
// }

async function readFile(filepath) {
  return await fs.readFile(filepath);
}

async function getDBCredentials() {

  let name, user, pass;

  if (IS_PROD) {

    const nameBuffer = await readFile(process.env.MONGODB_NAME_FILE);
    const userBuffer = await readFile(process.env.MONGODB_USER_FILE);
    const passBuffer = await readFile(process.env.MONGODB_PASSWORD_FILE);

    // replace last empty line character added by node's readFile
    name = nameBuffer.toString().replace('\n', '');
    user = userBuffer.toString().replace('\n', '');
    pass = passBuffer.toString().replace('\n', '');

  } else {
    name = process.env.MONGODB_NAME;
    user = process.env.MONGODB_USER;
    pass = process.env.MONGODB_PASSWORD;
  }

  return {
    name,
    user,
    pass
  };
}

main().catch(err => {
  console.log(err.cause);
  console.log(err.stack);
});

