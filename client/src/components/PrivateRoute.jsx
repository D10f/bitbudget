import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { addError } from '../redux/actions/notifications';

const PrivateRoute = ({ component: Component, isAuthenticated, addError, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (isAuthenticated) return <Component {...props} />
      addError('You are not authorized, please login.');
      return <Redirect to="/login" />
    }}
  />
);

// render={props => (
//   isAuthenticated
//   ? <Component {...props} />
//   : <Redirect to="/login" />
// )}

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
  addError: msg => dispatch(addError(msg))
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
