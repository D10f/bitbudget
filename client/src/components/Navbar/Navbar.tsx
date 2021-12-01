import React, { useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../app/hooks";
import Icon from "../../components/Icons/Icon";
import NavbarItem from "./NavbarItem";
import WalletSubMenu from "./WalletSubMenu";
import ProfileSubMenu from "./ProfileSubMenu";
import { AnimatePresence } from "framer-motion";

const Nav = styled.nav`
  width: 10rem;
  height: 94vh;
  border: 1px solid rgba(10, 10, 10, 0.1);
  /* margin: calc(100vh - 98vh) 4vh; */
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  /* grid-area: navbar; */
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
  const wallets = useAppSelector((state) => state.wallets);

  // Controls that only one menu is open at the same time
  const [navbarSubMenu, setNavbarSubMenu] = useState<string | null>(null);

  return (
    <Nav>
      <NavbarMenu>
        <AnimatePresence>
          {wallets.map((wallet) => (
            <NavbarItem
              key={wallet.id}
              id={wallet.id}
              setNavbarSubMenu={setNavbarSubMenu}
              active={wallet.isCurrent}
              icon={<Icon name="wallet" />}
            >
              <WalletSubMenu
                wallet={wallet}
                isSubMenuOpen={navbarSubMenu === wallet.id}
                closeSubMenu={() => setNavbarSubMenu(null)}
              />
            </NavbarItem>
          ))}

          <NavbarItem
            id={"1234"}
            setNavbarSubMenu={setNavbarSubMenu}
            active={false}
            icon={<Icon name="cog" />}
          >
            <ProfileSubMenu
              id={"1234"}
              key="1234"
              isSubMenuOpen={navbarSubMenu === "1234"}
              closeSubMenu={() => setNavbarSubMenu(null)}
            />
          </NavbarItem>
        </AnimatePresence>
      </NavbarMenu>
    </Nav>
  );
};

export default Navbar;
