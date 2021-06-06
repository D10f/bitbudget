import { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import updateTheme from './utils/updateTheme';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import Notification from './components/Notification';

import Dashboard from './pages/Dashboard';
import ExpensePage from './pages/ExpensePage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import AddWallet from './pages/AddWallet';
import WalletSettings from './pages/WalletSettings';
import About from './pages/About';

const App = ({ isAuthenticated, theme, primaryColor, filters }) => {

  useEffect(() => {
    updateTheme(theme, primaryColor);
  }, [theme, primaryColor]);

  return (
    <>
      <Sidebar />
      <Notification />
      <main className="main">
        <Header />
        <Switch>
          <Route path='/about' component={About} />
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup} />
          <PrivateRoute exact path='/' component={Dashboard} />
          <PrivateRoute path='/expenses' component={ExpensePage} />
          <PrivateRoute path='/add-expense' component={AddExpensePage} />
          <PrivateRoute path='/edit-expense/:id' component={EditExpensePage} />
          <PrivateRoute path='/profile' component={Profile} />
          <PrivateRoute path='/settings/' component={WalletSettings} />
          <PrivateRoute path='/add-wallet/' component={AddWallet} />
        </Switch>
      </main>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  theme: state.theme.theme,
  primaryColor: state.theme.primary,
  filters: state.filters
});

export default connect(mapStateToProps)(App);
