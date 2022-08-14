
/**
 *  This standalone script will be used to seed the database with fake data for demo purposes
 */

import { webcrypto } from 'crypto';
import moment from 'moment';
import axios from 'axios';
import minifaker from 'minifaker';
import 'minifaker/dist/locales/en';

const USER = {
  username: 'Luigi',
  email: 'luigi@example.org',
  password: 'iamnotmario',
  token: null
};

const CRYPTO_KEY = await generateCryptoKey();
const SALT = webcrypto.getRandomValues(new Uint8Array(32));

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

let defaultWalletId = null; // to be be updated when user is created
let createdWalletId = minifaker.uuid.v4();

async function main() {

  // REGISTER NEW USER
  const response = await axios.post('http://localhost:5000/auth/signup', {
    username: USER.username,
    password: USER.password,
    email: USER.email
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // STORE AUTH JSON TOKEN
  USER.token = response.data.accessToken;
  defaultWalletId = response.data.defaultWalletId;

  // REGISTER NEW WALLET FOR TEST USER
  await axios.post('http://localhost:5000/wallets/', {
    id: createdWalletId,
    name: minifaker.arrayElement(WALLET_NAMES),
    budget: minifaker.number({ min: 1000, max: 5000 }),
    currency: minifaker.arrayElement(CURRENCIES),
    isCurrent: false,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${USER.token}`,
    },
  });
}

async function createExpense() {

  const currentDate = moment(Date.now());

  // calculate random month based on current date
  const m = 1 + minifaker.number({
    min: currentDate.month() - 1,
    max: currentDate.month() + 1,
  });
  const y = currentDate.year();
  const d = currentDate.date();

  // actual date to be used for the random expense
  const expenseDate = new Date(`${y}-${m}-${d}`);

  const data = {
    title: bsGenerator(2, 5),
    description: bsGenerator(4, 8),
    amount: number({ min: 5, max: 600, float: Math.random() > 0.5 }),
    category: minifaker.arrayElement(CATEGORIES),
    // only need to specify the month for now:
    // produce random data for current, previous or next months
    createdAt: expenseDate,
  };

  const encryptedExpense = {
    id: minifaker.uuid.v4(),
    data,
    walletId: minifaker.arrayElement([defaultWalletId, createdWalletId]),
    expenseDate: formatDateAsMMYY(expenseDate)
  };
}

function bsGenerator(min, max) {
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

function formatDateAsMMYY(date) {
  const momentObj = moment(date);
  const month = (momentObj.month() + 1).toString().padStart(2, '0');
  const year = momentObj.year().toString().slice(2);
  return `${month}${year}`;
}

async function generateCryptoKey() {
  const keyMaterial = await webcrypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(USER.password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return await webcrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: webcrypto.getRandomValues(new Uint32Array(32)),
      iterations: 250_000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptData(data) {
  const iv = webcrypto.getRandomValues(new Uint8Array(16));

  const encryptedBuffer = await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    CRYPTO_KEY,
    data
  );

  return new Uint8Array([...SALT, ...iv, ...new Uint8Array(encryptedBuffer)])
}

async function encryptDataObj(obj) {
  const objBuffer = Buffer.from(JSON.stringify(obj));
  const encryptedBuffer = await encryptData(objBuffer);
  return Buffer.from(encryptedBuffer).toString('base64');
}

// async function decryptData(buffer) {
//   const encryptedBytes = new Uint8Array(buffer);
//   const iv = encryptedBytes.slice(32, 32 + 16);
//   const data = encryptedBytes.slice(32 + 16);

//   return await webcrypto.subtle.decrypt(
//     { name: 'AES-GCM', iv },
//     CRYPTO_KEY,
//     data
//   );
// }

main();
