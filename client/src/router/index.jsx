import { Route, Switch } from 'react-router-dom';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import AddWallet from '../pages/Wallets/AddWallet';
import EditWallet from '../pages/Wallets/EditWallet';
import AddExpense from '../pages/Expenses/AddExpense';
import EditExpense from '../pages/Expenses/EditExpense';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => (
  <Switch>
    <Route path='/login' component={Login} />
    <Route path='/signup' component={Signup} />
    <PrivateRoute path='/' exact component={Dashboard} />
    <PrivateRoute path='/profile' component={Profile} />
    <PrivateRoute path='/add-wallet' component={AddWallet} />
    <PrivateRoute path='/edit-wallet/:id' component={EditWallet} />
    <PrivateRoute path='/add-expense' component={AddExpense} />
    <PrivateRoute path='/edit-expense/:id' component={EditExpense} />
  </Switch>
);

export default AppRouter;
