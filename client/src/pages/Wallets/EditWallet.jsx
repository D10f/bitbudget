import { useCallback } from 'react';
import { connect } from 'react-redux';
import { startUpdateWallet, startRemoveWallet } from '../../redux/wallets/actions';

import WalletForm from './WalletForm';

const EditWallet = ({ wallet, updateWallet, removeWallet }) => {

  const handleSubmit = useCallback(({ name, budget, currency }) => {
    // During validation budget gets coerced into a Number
    updateWallet({ id: wallet.id, name, budget: budget.toString(), currency });
  });

  const handleRemove = useCallback(id => removeWallet(id));

  return (
    <WalletForm
      wallet={wallet}
      handleSubmit={handleSubmit}
      handleRemove={handleRemove}
    />
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
