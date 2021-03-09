import { SET_WALLETS, ADD_WALLET, REMOVE_WALLET, UPDATE_WALLET, SET_CURRENT } from '../actionTypes';
import { v4 as uuidv4 } from 'uuid';

const initialState = [{
  id: uuidv4(),
  name: 'Default',
  budget: 0,
  currency: '$',
  isCurrent: true
}];

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLETS:
      return action.payload;
    case ADD_WALLET:
      return [
        ...state,
        action.payload
      ];
    case REMOVE_WALLET:
      return state.filter(wallet => wallet.id !== action.payload.id);
    case UPDATE_WALLET:
      return state.map(wallet => wallet.id === action.payload.id ? action.payload : wallet);
    case SET_CURRENT:
      return state.map(wallet => {
        return wallet.id === action.payload
          ? { ...wallet, isCurrent: true }
          : { ...wallet, isCurrent: false }
      });
    default:
      return state;
  }
};

export default expenseReducer;
