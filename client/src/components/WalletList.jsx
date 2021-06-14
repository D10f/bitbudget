import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import WalletItem from './WalletItem';

const WalletList = ({ wallets }) => (
  <>
    {
      wallets.map(wallet => <WalletItem key={wallet.id} wallet={wallet} />)
    }
    <li className="sidebar__item">
      <Link
        to="/add-wallet"
        className="sidebar__wallet sidebar__wallet--last"
        name="Add Wallet"
      >+</Link>
    </li>

  </>
);

const mapStateToProps = (state) => ({
  wallets: state.wallets
});

export default connect(mapStateToProps)(WalletList);
