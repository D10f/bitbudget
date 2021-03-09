import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

const Header = ({ wallet, user, isAuthenticated }) => {

  const location = useLocation();

  return (
    <nav className="main__nav">
      <ul className="main__menu">
        <li className="main__tab">
          <Link
            to="/"
            className={location.pathname === '/' ? "main__link main__link--active" : "main__link"}>
            Dashboard
          </Link>
        </li>
        <li className="main__tab">
          <Link
            to="/expenses"
            className={location.pathname.includes('expense') ? "main__link main__link--active" : "main__link"}>
            Expenses
          </Link>
        </li>
        <li className="main__tab">
          <Link
            to="/settings"
            className={location.pathname === '/settings' ? "main__link main__link--active" : "main__link"}>
            Settings
          </Link>
        </li>
        {
          isAuthenticated ?
            <li className="main__tab main__tab--right">
              <Link
                to="/profile"
                className={location.pathname === '/profile' ? "main__link main__link--active" : "main__link"}>
                Profile
              </Link>
            </li>
          :
            <li className="main__tab main__tab--right">
              <Link
                to="/login"
                className={location.pathname === '/login' ? "main__link main__link--active" : "main__link"}>
                Login
              </Link>
              <Link
                to="/signup"
                className={location.pathname === '/signup' ? "main__link main__link--active" : "main__link"}>
                Signup
              </Link>
            </li>
        }
      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  wallet: state.wallets.find(wallet => wallet.isCurrent === true),
  isAuthenticated: state.user.isAuthenticated,
  user: state.user
});

export default connect(mapStateToProps)(Header);
