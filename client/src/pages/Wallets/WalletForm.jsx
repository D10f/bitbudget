import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setCurrentWallet } from '../../redux/wallets/actions';
import { walletSchema } from '../../utils/schemas';
import useFormValidation from '../../hooks/useFormValidation';

import Form from '../../components/Form';
import FormControl from '../../components/FormControl';
import TextInput from '../../components/TextInput';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';

const allowedCurrencies = [ '€', '£', '$', '¥', '₹', '元' ];

const WalletForm = ({
  wallet,
  handleSubmit,
  handleRemove,
  isLoading,
  setCurrentWallet
}) => {

  const validateSchema = useFormValidation(walletSchema);

  const [ name, setName ] = useState(wallet ? wallet.name : '');
  const [ budget, setBudget ] = useState(wallet ? wallet.budget : '');
  const [ currency, setCurrency ] = useState(wallet ? wallet.currency : '€');

  useEffect(() => {
    wallet && !wallet.isCurrent && setCurrentWallet(wallet.id);
    setName(wallet ? wallet.name : '');;
    setBudget(wallet ? wallet.budget : '');;
    setCurrency(wallet ? wallet.currency : '€');;
  }, [wallet]);

  const onAmountChange = e => {
    const amount = e.target.value;
    if (!amount || amount.match(/^\d+(\.\d{0,2})?$/)) {
      setBudget(amount);
    }
  };

  const onCurrencyChange = e => {
    const currency = e.target.value;
    if (currency && allowedCurrencies.includes(currency)) {
      setCurrency(currency);
    }
  };

  return (
    <Form onSubmit={validateSchema({ name, budget, currency }, handleSubmit)} >

      <FormControl>
        <TextInput
          label="Wallet Name"
          value={name}
          name="name"
          placeholder="e.g., Trip to Malta"
          autoFocus={true}
          onChange={e => setName(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <TextInput
          label="Wallet Budget"
          value={budget}
          name="budget"
          placeholder="e.g., 750"
          onChange={onAmountChange}
        />
      </FormControl>

      <FormControl>
        <Dropdown
          label="Wallet Currency"
          name="currency"
          value={currency}
          onChange={onCurrencyChange}
          options={allowedCurrencies}
        />
      </FormControl>

    <FormControl modifiers="form__control-group--center mt-2">
      <Button
        text={wallet ? "Save Changes" : "Add New Wallet"}
        type="submit"
        loading={isLoading}
      />
      { wallet && (
        <Button
          text="Delete"
          type="button"
          loading={isLoading}
          onClick={() => handleRemove(wallet.id)}
        />
      )}
    </FormControl>

    </Form>
  );
};

const mapStateToProps = state => ({
  isLoading: state.wallets.isLoading
});

const mapDispatchToProps = dispatch => ({
  setCurrentWallet: id => dispatch(setCurrentWallet(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
