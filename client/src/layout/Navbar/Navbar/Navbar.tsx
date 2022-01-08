import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppSelector } from "@hooks/useAppSelector";
import Icon from "@components/Icon/Icon";
import NavbarItem from "../NavbarItem/NavbarItem";
import WalletSubMenu from "../WalletSubMenu/WalletSubMenu";
import ProfileSubMenu from "../ProfileSubMenu/ProfileSubMenu";
import { Nav, NavbarMenu } from "./Navbar.styled";

const Navbar = () => {
  const wallets = useAppSelector((state) => state.wallets.wallets);

  // Controls that only one menu is open at the same time
  const [navbarSubMenu, setNavbarSubMenu] = useState<string | null>(null);

  return (
    <Nav>
      <NavbarMenu>
        {wallets.map((wallet) => (
          <NavbarItem
            key={wallet.id}
            id={wallet.id}
            setNavbarSubMenu={setNavbarSubMenu}
            active={wallet.isCurrent}
            icon={<Icon name="wallet" />}
          >
            <AnimatePresence>
              {navbarSubMenu === wallet.id && (
                <WalletSubMenu
                  key={wallet.id}
                  wallet={wallet}
                  isSubMenuOpen={navbarSubMenu === wallet.id}
                  closeSubMenu={() => setNavbarSubMenu(null)}
                />
              )}
            </AnimatePresence>
          </NavbarItem>
        ))}

        <NavbarItem
          id="-1"
          setNavbarSubMenu={setNavbarSubMenu}
          active={false}
          icon={<Icon name="cog" />}
        >
          <AnimatePresence>
            {navbarSubMenu === "-1" && (
              <ProfileSubMenu
                isSubMenuOpen={navbarSubMenu === "-1"}
                closeSubMenu={() => setNavbarSubMenu(null)}
              />
            )}
          </AnimatePresence>
        </NavbarItem>
      </NavbarMenu>
    </Nav>
  );
};

export default Navbar;
