import { connect } from 'react-redux';

import SidebarItem from './SidebarItem';

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
    <path fill="#363933" d="M1 10h3v10h-3v-10zM6 0h3v20h-3v-20zM11 8h3v12h-3v-12zM16 4h3v16h-3v-16z"></path>
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
    <path fill="#363933" d="M0 4c0-1.1 0.9-2 2-2h15c0.552 0 1 0.448 1 1v0 1h-16v1h17c0.552 0 1 0.448 1 1v0 10c0 1.105-0.895 2-2 2v0h-16c-1.105 0-2-0.895-2-2v0-12zM16.5 13c0.828 0 1.5-0.672 1.5-1.5s-0.672-1.5-1.5-1.5v0c-0.828 0-1.5 0.672-1.5 1.5s0.672 1.5 1.5 1.5v0z"></path>
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
    <path fill="#363933" d="M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z"></path>
  </svg>
);

const Sidebar = ({ isOpen, handleOpenDrawer, wallets, isAuthenticated }) => (
  <nav className={isOpen ? "sidebar sidebar--open" : "sidebar sidebar--close" }>
    <ul className="sidebar__menu">
      <SidebarItem to="/" name="Dashboard" text={<DashboardIcon />} />

      {isAuthenticated && (
        <>
          {wallets.map(wallet => (
            <SidebarItem
              key={wallet.id}
              to={`/edit-wallet/${wallet.id}`}
              name={wallet.name}
              currency={wallet.currency}
              active={wallet.isCurrent}
              text={<WalletIcon />}
            />
          ))}
          <SidebarItem to="/add-wallet" name="Add Wallet" text="+" />
          <SidebarItem to="/profile" name="Profile" text={<ProfileIcon/>} />
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
