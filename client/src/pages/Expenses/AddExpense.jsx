import { connect } from 'react-redux';
import { startAddExpense } from '../../redux/expenses/actions';
// import { selectCurrentWallet } from '../redux/selectors/wallets';

import ExpenseForm from './ExpenseForm';

const AddExpense = ({ wallet, addExpense, history }) => {

  const onSubmit = ({ createdAt, title, amount, description, category }) => {

    const expense = {
      createdAt: createdAt.toString(),
      title,
      description,
      amount: parseFloat(amount, 10) * 100,
      category,
      wallet: wallet.id
    };

    addExpense(expense)
      .then(done => {
        if (done) history.push('/');
      });
  };

  return (
    <section className="expense-page">
      <h2 className="has-text-center py-2">Create New Expense</h2>
      <ExpenseForm onSubmit={onSubmit} />
    </section>
  );
};

const mapStateToProps = state => ({
  wallet: state.wallets.wallets.find(wallet => wallet.isCurrent)
});

const mapDispatchToProps = dispatch => ({
  addExpense: expense => dispatch(startAddExpense(expense))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddExpense);
