import { connect } from 'react-redux';
import { startUpdateWallet, startRemoveWallet } from '../../redux/wallets/actions';

import WalletForm from './WalletForm';

const EditWallet = ({ wallet, updateWallet, removeWallet, history }) => {

  const handleSubmit = ({ name, budget, currency }) => {
    // During validation budget gets coerced into a Number
    updateWallet({
      id: wallet.id,
      name,
      budget: budget.toString(),
      currency,
      isCurrent: true
    });
  };

  const handleRemove = id => {
    history.push('/');
    removeWallet(id);
  };

  return (
    <>
      <h2 className="has-text-center py-2">Editing Wallet "{wallet.name}"</h2>
      <WalletForm
        wallet={wallet}
        handleSubmit={handleSubmit}
        handleRemove={handleRemove}
      />
    </>
  );
};

const mapStateToProps = (state, props) => ({
  wallet: state.wallets.wallets.find(w => w.id === props.match.params.id)
});

const mapDispatchToProps = (dispatch) => ({
  updateWallet: wallet => dispatch(startUpdateWallet(wallet)),
  removeWallet: id => dispatch(startRemoveWallet(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditWallet);
