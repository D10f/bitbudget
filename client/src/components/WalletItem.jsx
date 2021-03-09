import { connect } from 'react-redux';
import { setCurrentWallet } from '../redux/actions/wallet';

const WalletItem = ({ wallet, setCurrentWallet }) => {

  const { id, name, isCurrent } = wallet;
  
  return (
    <li className={isCurrent ? "sidebar__item sidebar__item--active" : "sidebar__item"}>
      <button
        className="sidebar__wallet"
        name={name}
        onClick={() => setCurrentWallet(id)}
      >
        <span className="sidebar__text">{name}</span>
      </button>
    </li>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentWallet: (id) => dispatch(setCurrentWallet(id))
});

export default connect(undefined, mapDispatchToProps)(WalletItem);
