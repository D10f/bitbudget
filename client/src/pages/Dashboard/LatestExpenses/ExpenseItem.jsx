import React from 'react';
import { connect } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import moment from 'moment';
import numeral from 'numeral';

const enterAnimation = {
  initial: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: 10 } ,
  transition: {
    duration: 0.6
  }
};

const ExpenseItem = ({ expense, currency }) => {
  const { id, title, createdAt, amount } = expense;

  return (
    <AnimatePresence>
      <motion.li
        className="expenses__item"
        key={expense.id}
        variants={enterAnimation}
        initial='initial'
        animate='visible'
        exit='exit'
      >
        <Link to={`/edit-expense/${id}`} className="expenses__title">{title}</Link>
        <p className="expenses__createdAt">{moment(createdAt).format('D/MM/Y')}</p>
        <p className="expenses__amount">{currency}{numeral(amount / 100).format(`0,0.00`)}</p>
      </motion.li>
    </AnimatePresence>
  );
};

const mapStateToProps = state => ({
  currency: state.wallets.wallets.find(w => w.isCurrent).currency
});

export default connect(mapStateToProps)(React.memo(ExpenseItem));
// export default connect(mapStateToProps)(ExpenseItem);

// <p className="expenses__category">Food</p>
// <p className="expenses__description">A very long description to make sure anyone reading this can understand, clearly, what this expense is all about</p>
