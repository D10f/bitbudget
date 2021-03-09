import { connect } from 'react-redux';
import WalletItem from './WalletItem';

const WalletList = ({ wallets }) => (
  <>
  {
    wallets.map(wallet => <WalletItem key={wallet.id} wallet={wallet} />)
  }
  </>
);

const mapStateToProps = (state) => ({
  wallets: state.wallets
});

export default connect(mapStateToProps)(WalletList);
