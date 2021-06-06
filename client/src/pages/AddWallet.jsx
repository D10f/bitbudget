import { connect } from 'react-redux';
import { addWallet } from '../redux/actions/wallet';
import { v4 as uuidv4 } from 'uuid';
import WalletForm from '../components/WalletForm';

const AddWallet = ({ addWallet, history }) => {

  const handleSubmit = (name, budget, currency) => {

    const newWallet = {
      id: uuidv4(),
      name,
      budget,
      currency,
      isCurrent: false
    };

    addWallet(newWallet);
  };

  return (
    <WalletForm handleSubmit={handleSubmit} />
  );
};

const mapDispatchToProps = (dispatch) => ({
  addWallet: (wallet) => dispatch(addWallet(wallet))
});

export default connect(undefined, mapDispatchToProps)(AddWallet);
