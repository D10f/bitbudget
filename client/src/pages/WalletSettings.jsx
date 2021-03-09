import { connect } from 'react-redux';
import useSnapshot from '../hooks/useSnapshot';
import { updateWallet } from '../redux/actions/wallet';
import WalletForm from '../components/WalletForm';

const WalletSettings = ({ wallet, updateWallet }) => {

  const createSnapshot = useSnapshot();

  const handleSubmit = (name, budget, currency) => {
    const newWallet = {
      id: wallet.id,
      name,
      budget,
      currency,
      isCurrent: true
    };

    updateWallet(newWallet);
    createSnapshot();
  };

  return (
    <WalletForm wallet={wallet} handleSubmit={handleSubmit} />
  );
};

const mapStateToProps = (state) => ({
  wallet: state.wallets.find(wallet => wallet.isCurrent)
});

const mapDispatchToProps = (dispatch) => ({
  updateWallet: (wallet) => dispatch(updateWallet(wallet))
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSettings);
