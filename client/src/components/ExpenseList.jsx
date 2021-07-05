import { connect } from 'react-redux';
import { selectCurrentWallet } from '../redux/selectors/wallets';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({
  wallet,
  expenses,
  sortBy = '',
  sortDesc = true,
  handleSort = () => {}
}) => {

  const activeClass = sortDesc
    ? 'expense__header expense__header--active-desc'
    : 'expense__header expense__header--active-asc';

  return (
    <ul className="expense__list">
      <li className="expense__item" key="expenses__unique-key">
        <article className="expense__card expense__card--headers">
          <p
            className={sortBy === 'createdAt' ? activeClass : 'expense__header'}
            id="createdAt"
            onClick={handleSort}>
            Date
          </p>
          <p
            className={sortBy === 'title' ? activeClass : 'expense__header'}
            id="title"
            onClick={handleSort}>
            Title
          </p>
          <p
            className={sortBy === 'category' ? activeClass : 'expense__header'}
            id="category"
            onClick={handleSort}>
            Category
          </p>
          <p className="expense__header">Description</p>
          <p
            className={sortBy === 'amount' ? activeClass : 'expense__header'}
            id="amount"
            onClick={handleSort}>
            Amount
          </p>
        </article>
      </li>
      { expenses && (
        expenses.map(expense => (
          <li className="expense__item" key={expense._id} tabIndex="-1">
            <ExpenseItem currency={wallet.currency} _id={expense._id} {...expense.data} />
          </li>
        ))
      )}
    </ul>
  );
};

const mapStateToProps = state => ({
  wallet: selectCurrentWallet(state)
});

export default connect(mapStateToProps)(ExpenseList);
