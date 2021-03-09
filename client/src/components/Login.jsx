import { useState } from 'react';
import { connect } from 'react-redux';
import useRestore from '../hooks/useRestore';
import { startLoginUser } from '../redux/actions/user';
import { setTheme, setPrimaryColor } from '../redux/actions/theme';
import { setExpenses } from '../redux/actions/expenses';
import { setWallets } from '../redux/actions/wallet';
import { setCategories } from '../redux/actions/categories';

const Login = ({ startLoginUser, setExpenses, setWallets, setCategories, setTheme, setPrimaryColor, history }) => {

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const restoreSnapshot = useRestore();

  const handleSubmit = (e) => {
    e.preventDefault();
    startLoginUser(credentials).then(token => {
      restoreSnapshot(token)
        .then(store => {

          console.log(store);

          if (!store) {
            throw new Error('Something went wrong retrieving your data, please try again or contact support');
          }

          setExpenses(store.expenses);
          setWallets(store.wallets);
          setCategories(store.categories);
          setTheme(store.theme.theme);
          setPrimaryColor(store.theme.primary);
          history.push('/');
        });
    })
    .catch(err => {
      history.push('/');
    });
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form
      className="form"
      onSubmit={handleSubmit}>
      <div className="form__control-group">
        <label className="form__label" htmlFor="username">Username</label>
        <input
          className="form__input"
          value={credentials.username}
          onChange={handleChange}
          name="username"
          id="username"
          placeholder="username"
        />
      </div>
      <div className="form__control-group">
        <label className="form__label" htmlFor="password">Password</label>
        <input
          className="form__input"
          value={credentials.password}
          onChange={handleChange}
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
      </div>
      <button className="btn">Login</button>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => ({
  startLoginUser: (userCredentials) => dispatch(startLoginUser(userCredentials)),
  setExpenses: (expenses) => dispatch(setExpenses(expenses)),
  setWallets: (wallets) => dispatch(setWallets(wallets)),
  setCategories: (categories) => dispatch(setCategories(categories)),
  setTheme: (theme) => dispatch(setTheme(theme)),
  setPrimaryColor: (color) => dispatch(setPrimaryColor(color))
});

export default connect(undefined, mapDispatchToProps)(Login);
