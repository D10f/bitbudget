import React from "react";
import styled from "styled-components";

interface INavbarItemProps {
  id: string;
  active: boolean;
  icon: JSX.Element | string;
  children: React.ReactChild;
  setNavbarSubMenu: React.Dispatch<React.SetStateAction<string | null>>;
}

interface INavItemStyles {
  active: boolean;
}

const NavItem = styled.li<INavItemStyles>`
  border-radius: 50%;
  width: 6rem;
  height: 6rem;
  background-color: ${({ theme }) => theme.colors.light};
  position: relative;

  &:last-child {
    margin-top: auto;
    &::before {
      display: none;
    }
  }

  &:hover::before {
    height: ${({ active }) => (active ? "60%" : "0.5rem")};
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: -1rem;
    width: 0.5rem;
    height: ${({ active }) => (active ? "60%" : "0")};
    border-radius: ${({ theme }) => theme.layout.borderRadius};
    transform: translateY(-50%);
    transition: height 0.2s;
    background-color: ${({ theme }) => theme.colors.primary.default};
    overflow: hidden;
  }
`;

const NavBtn = styled.button`
  border: none;
  border-radius: 50%;
  width: 6rem;
  height: 6rem;
  background: none;

  svg {
    width: 3.2rem;
    height: 3.2rem;
  }

  &:hover {
    cursor: pointer;
  }
  &:active {
    background-color: ${({ theme }) => theme.colors.primary.default};
  }
`;

const NavbarItem = ({
  id,
  active,
  icon,
  children,
  setNavbarSubMenu,
}: INavbarItemProps) => {

  const toggleMenu = () => {
    setNavbarSubMenu((prev) => (prev === id ? null : id));
  };

  return (
    <NavItem active={active}>
      <NavBtn onClick={toggleMenu}>{icon}</NavBtn>
      {children}
    </NavItem>
  );
};

export default NavbarItem;
