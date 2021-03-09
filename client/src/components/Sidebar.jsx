import { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import WalletList from './WalletList';

const Sidebar = ({ user }) => {

  const [visibility, setVisibility] = useState(false);

  return (
    <aside className={visibility ? "sidebar sidebar--visible" : "sidebar"}>
      <button
        className={visibility ? "sidebar__toggle sidebar__toggle--visible" : "sidebar__toggle"}
        onClick={() => setVisibility(!visibility)}
      >
        &gt;
      </button>

      <nav className="sidebar__navigation">
        <ul className="sidebar__menu">
          <WalletList />
        </ul>
      </nav>

      <footer className={visibility ? "sidebar__footer sidebar__footer--visible" : "sidebar__footer"}>
        <nav>
          <ul>
            <li className="sidebar__footer-item"><Link to="/about" className="sidebar__footer-text">About</Link></li>
            <li className="sidebar__footer-item"><Link to="/privacy" className="sidebar__footer-text">Privacy</Link></li>
            <li className="sidebar__footer-item"><Link to="/terms" className="sidebar__footer-text">Terms</Link></li>
          </ul>
        </nav>
      </footer>
    </aside>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Sidebar);

// {user && <li className="sidebar__item">
//   <button className="sidebar__wallet" name="Profile">
//     <Link to="/profile" className="sidebar__text">User Profile</Link>
//   </button>
// </li>}
