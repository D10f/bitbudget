import { connect } from 'react-redux';
import useSnapshot from '../hooks/useSnapshot';
import { addWallet, setCurrentWallet } from '../redux/actions/wallet';
import { v4 as uuidv4 } from 'uuid';
import WalletForm from '../components/WalletForm';

const AddWallet = ({ addWallet, setCurrentWallet, history }) => {

  const createSnapshot = useSnapshot();

  const handleSubmit = (name, budget, currency) => {

    const newWallet = {
      id: uuidv4(),
      name,
      budget,
      currency,
      isCurrent: false
    };

    addWallet(newWallet);
    setCurrentWallet(newWallet.id);
    createSnapshot().then(history.push('/settings'));
  };

  return (
    <WalletForm handleSubmit={handleSubmit} />
  );
};

const mapDispatchToProps = (dispatch) => ({
  addWallet: (wallet) => dispatch(addWallet(wallet)),
  setCurrentWallet: (id) => dispatch(setCurrentWallet(id))
});

export default connect(undefined, mapDispatchToProps)(AddWallet);
