import React, { useState } from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useAppSelector } from "@hooks/useAppSelector";
import Icon from "@components/Icon/Icon";
import NavbarItem from "./NavbarItem/NavbarItem";
import WalletSubMenu from "./WalletSubMenu/WalletSubMenu";
import ProfileSubMenu from "./ProfileSubMenu/ProfileSubMenu";

const Nav = styled.nav`
  grid-area: navbar;
  width: 10rem;
  border: 1px solid rgba(10, 10, 10, 0.1);
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
`;

const NavbarMenu = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
  padding: 2rem 0;
  height: 100%;
`;

const Navbar = () => {
  const wallets = useAppSelector((state) => state.wallets.wallets);
  // const user = useAppSelector((state) => state.user.user);

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
