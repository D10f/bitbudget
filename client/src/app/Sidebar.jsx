import { connect } from 'react-redux';

import SidebarItem from './SidebarItem';

const Sidebar = ({ isOpen, handleOpenDrawer, wallets, isAuthenticated }) => (
  <nav className={isOpen ? "sidebar sidebar--open" : "sidebar sidebar--close" }>
    <ul className="sidebar__menu">
      <SidebarItem to="/" name="Home" />

      {isAuthenticated && (
        <>
          {wallets.map(wallet => (
            <SidebarItem
              key={wallet.id}
              to={`/edit-wallet/${wallet.id}`}
              name={wallet.name}
              active={wallet.isCurrent}
            />
          ))}
          <SidebarItem to="/add-wallet" name="Add Wallet" text="+" />
          <SidebarItem to="/profile" name="Profile" />
        </>
      )}
    </ul>
  </nav>
);

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  wallets: state.wallets.wallets
});

export default connect(mapStateToProps)(Sidebar);
