import Ajv from 'ajv';

export default new Ajv({ $data: true, coerceTypes: true });

/**
 * Used during new user signup
 */
export const userSignupSchema = {
  type: 'object',
  properties: {
    username:  { type: 'string', minLength: 1 },
    password:  { type: 'string', minLength: 8 },
    password2: { type: 'string', const: { $data: '1/password' }},
    confirm:   { type: 'string', maxLength: 0 }
  },
  required: [ 'username', 'password', 'password2' ],
  additionalProperties: false
};

/**
 * Used for user-specific settings in /profile
 */
export const userProfileSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      if: { minLength: 1 },
      then: { format: 'email' }
    },
    accountPassword: {
      type: 'string',
      if: { minLength: 1 },
      then: { minLength: 8 }
    },
    accountPasswordConfirm: {
      type: 'string',
      const: { $data: '1/accountPassword' }
    },
    encryptionPassword: {
      type: 'string',
      if: { minLength: 1 },
      then: { const: { $data: '1/encryptionPasswordConfirm' } }
    },
    encryptionPasswordConfirm: {
      type: 'string',
      then: { const: { $data: '1/encryptionPassword' }}
    }
  },
  required: [],
  additionalProperties: false
};

/**
 * Used for adding or updating a wallet object
 */
export const walletSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1
    },
    budget: {
      type: 'number',
      minimum: 0
    },
    currency: {
      type: 'string',
      minLength: 1,
      maxLength: 1
    }
  },
  required: [ 'name', 'budget', 'currency' ],
  additionalProperties: false
};

/**
 * Used for adding or updating an expense object
 */
export const expenseSchema = {
  type: 'object',
  properties: {
    createdAt: { type: 'object' },
    title: { type: 'string', minLength: 1 },
    amount: { type: 'number' },
    description: {  type: 'string' },
    category: {  type: 'string', minLength: 1 },
  },
  required: [ 'createdAt', 'title', 'amount', 'category' ],
  additionalProperties: false
};
