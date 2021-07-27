import * as actions from './types';

const initialState = {
  wallets: [],
  isLoading: false
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_WALLET_LOADING:
      return {
        ...state,
        isLoading: true
      };

    case actions.STOP_WALLET_LOADING:
      return {
        ...state,
        isLoading: false
      };

    case actions.ADD_WALLET:
      const newArray = [ ...state.wallets, action.payload ];
      if (newArray.length === 1) {
        newArray[0].isCurrent = true;
      }

      return {
        wallets: newArray,
        isLoading: false
      };

    case actions.REMOVE_WALLET:
      const newWalletsArray = state.wallets.filter(wallet => {
        return wallet.id !== action.payload;
      });

      // Choose another "current wallet"
      if (newWalletsArray.length) {
        newWalletsArray[0].isCurrent = true;
      }

      return {
        wallets: newWalletsArray,
        isLoading: false
      };

    case actions.UPDATE_WALLET:
      return {
        ...state,
        wallets: state.wallets.map(wallet => {
          return wallet.id === action.payload.id ? action.payload : wallet;
        })
      };

    case actions.SET_CURRENT_WALLET:
      return {
        ...state,
        wallets: state.wallets.map(wallet => {
          return wallet.id === action.payload
            ? { ...wallet, isCurrent: true }
            : { ...wallet, isCurrent: false }
          })
      };

    case actions.SET_WALLETS:
      return action.payload;

    default:
      return state;
  }
};

export default walletReducer;
