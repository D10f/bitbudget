import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectCurrentWallet } from '../redux/selectors/expenses';

const WalletForm = ({ wallet, handleSubmit }) => {

  const [name, setName] = useState(wallet ? wallet.name : '');
  const [budget, setBudget] = useState(wallet ? wallet.budget : '');
  const [currency, setCurrency] = useState(wallet ? wallet.currency : '$');

  const handleClick = () => {
    if (!name || !budget || !currency) {
      return console.log('You must provide name, budget and currency values');
    }

    handleSubmit(name, budget, currency);
  };

  useEffect(() => {
    setName(wallet ? wallet.name : '');
    setBudget(wallet ? wallet.budget : '');
    setCurrency(wallet ? wallet.currency : '$');
  }, [wallet]);

  return (
    <section className="settings">
      <header className="settings__header">
        <h2>
          {
            wallet ? `Settings for ${name}` : 'Create New Wallet'
          }
        </h2>
      </header>

      <ul className="settings__list">
        <li className="settings__setting">
          <label htmlFor="">Wallet Name</label>
          <input
            className="settings__text-input"
            value={name}
            placeholder="e.g., Trip to Malta"
            onChange={(e) => setName(e.target.value)}
          />
        </li>
        <li className="settings__setting">
          <label htmlFor="">Monthly Budget</label>
          <input
            className="settings__text-input"
            value={budget}
            placeholder="e.g., 840.00"
            onChange={(e) => setBudget(e.target.value)}
          />
        </li>
        <li className="settings__setting">
          <label htmlFor="">Currency</label>
          <select
            className="settings__currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="$">$</option>
            <option value="&pound;">&pound;</option>
            <option value="&euro;">&euro;</option>
            <option value="&yen;">&yen;</option>
            <option value="&#8377;">&#8377;</option>
            <option value="&#8360;">&#8360;</option>
            <option value="&#8369;">&#8369;</option>
            <option value="&#8381;">&#8381;</option>
            <option value="&#20803;">&#20803;</option>
            <option value="&#8362;">&#8362;</option>
            <option value="Kč">Kč</option>
          </select>
        </li>
      </ul>

      <div className="settings__actions">
        <Link to="/add-wallet" className="btn btn--action">New Wallet</Link>
        <button
          className="btn btn--action"
          onClick={handleClick}
        >
          {wallet ? 'Save Changes' : 'Add Wallet'}
        </button>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  wallet: selectCurrentWallet(state)
});

export default connect(mapStateToProps)(WalletForm);
