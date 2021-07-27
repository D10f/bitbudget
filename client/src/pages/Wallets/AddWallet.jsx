import { useCallback } from 'react';
import { connect } from 'react-redux';
import { startAddWallet } from '../../redux/wallets/actions';
import WalletForm from './WalletForm';

const AddWallet = ({ addWallet, history }) => {

  const handleSubmit = useCallback(({ name, budget, currency }) => {
    // During validation budget gets coerced into a Number
    addWallet({ name, budget: budget.toString(), currency });
  });

  return <WalletForm handleSubmit={handleSubmit} />
};

const mapDispatchToProps = (dispatch) => ({
  addWallet: wallet => dispatch(startAddWallet(wallet)),
});

export default connect(undefined, mapDispatchToProps)(AddWallet);
