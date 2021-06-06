import { connect } from 'react-redux';
import { startUpdateWallet } from '../redux/actions/wallet';
import { addMessage } from '../redux/actions/notifications';
import WalletForm from '../components/WalletForm';

const WalletSettings = ({ wallet, startUpdateWallet }) => {


  const handleSubmit = (name, budget, currency) => {
    const newWallet = {
      id: wallet.id,
      name,
      budget,
      currency,
      isCurrent: true
    };

    startUpdateWallet(newWallet)
      .then(() => addMessage('Wallet updated.'))
  };

  return (
    <WalletForm wallet={wallet} handleSubmit={handleSubmit} />
  );
};

const mapStateToProps = (state) => ({
  wallet: state.wallets.find(wallet => wallet.isCurrent)
});

const mapDispatchToProps = (dispatch) => ({
  startUpdateWallet: (wallet) => dispatch(startUpdateWallet(wallet))
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSettings);
