import React from "react";
import { NavItem, NavBtn } from './NavbarItem.styled';

interface INavbarItemProps {
  id: string;
  active: boolean;
  icon: JSX.Element | string;
  children: React.ReactChild;
  setNavbarSubMenu: React.Dispatch<React.SetStateAction<string | null>>;
}

const NavbarItem = ({
  id,
  active,
  icon,
  children,
  setNavbarSubMenu,
}: INavbarItemProps) => {
  const toggleMenu = () => {
    // This ensures that the current submenu is closed before a new one is opened,
    // which causes a glitch in the UI when switching from one menu to another.
    setImmediate(() => {
      setNavbarSubMenu((prev) => (prev === id ? null : id));
    });
  };

  return (
    <NavItem active={active}>
      <NavBtn onClick={toggleMenu} tabIndex={0}>
        {icon}
      </NavBtn>
      {children}
    </NavItem>
  );
};

export default NavbarItem;
