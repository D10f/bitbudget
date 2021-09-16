import { connect } from 'react-redux';
import { startAddWallet } from '../../redux/wallets/actions';
import WalletForm from './WalletForm';

const AddWallet = ({ addWallet, history }) => {

  const handleSubmit = ({ name, budget, currency }) => {
    // During validation budget gets coerced into a Number
    addWallet({ name, budget: budget.toString(), currency });
  };

  return (
    <>
      <h2 className="has-text-center py-2">Create A New Wallet</h2>
      <WalletForm handleSubmit={handleSubmit} />
    </>)
};

const mapDispatchToProps = (dispatch) => ({
  addWallet: wallet => dispatch(startAddWallet(wallet)),
});

export default connect(undefined, mapDispatchToProps)(AddWallet);
