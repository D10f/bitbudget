import { Link } from 'react-router-dom';
import numeral from 'numeral';
import moment from 'moment';

const ExpenseItem = ({ _id, title, category, amount, createdAt, description }) => {

  return (
    <article className="expense__card" tabIndex="0">
      <p className="expense__date">{moment(createdAt).format('D/MM/Y')}</p>
      <Link to={`/edit-expense/${_id}`} className="expense__title">{title}</Link>
      <p className="expense__category">{category}</p>
      <p className="expense__description">{description}</p>
      <p className="expense__amount">&euro;{numeral(amount / 100).format(`0,0.00`)}</p>
    </article>
  );
};

export default ExpenseItem;
