import styled from "styled-components";

interface INavItemStyles {
  active: boolean;
}

export const NavItem = styled.li<INavItemStyles>`
  border-radius: 50%;
  width: 6rem;
  height: 6rem;
  background-color: ${({ theme }) => theme.colors.light.default};
  position: relative;

  &:hover::before {
    height: ${({ active }) => (active ? "60%" : "0.5rem")};

    @media (max-width: ${({ theme }) => theme.breakpoints.tabletPortrait}) {
      height: 0.5rem;
      width: ${({ active }) => (active ? "60%" : "0.5rem")};
    }
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
    transition: all 0.2s;
    /* background-color: ${({ theme }) => theme.colors.primary.default}; */
    background-image: linear-gradient(
      to right bottom,
      ${({ theme }) => theme.colors.primary.light},
      ${({ theme }) => theme.colors.primary.dark}
    );
    overflow: hidden;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tabletPortrait}) {
      top: 110%;
      left: 50%;
      height: 0.5rem;
      width: ${({ active }) => (active ? "60%" : "0")};
      transform: translateX(-50%);
    }
  }

  &:last-child {
    margin-top: auto;
    &::before {
      display: none;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tabletPortrait}) {
    &:last-child {
      margin-top: 0;
      margin-left: auto;
    }
  }
`;

export const NavBtn = styled.button`
  border: none;
  border-radius: 50%;
  width: 6rem;
  height: 6rem;
  background: none;

  svg {
    fill: ${({ theme }) => theme.colors.dark.default};
    width: 3.2rem;
    height: 3.2rem;
  }

  &:hover {
    cursor: pointer;
  }
  &:hover svg,
  &:active svg,
  &:focus svg {
    fill: ${({ theme }) => theme.colors.primary.default};
  }
`;
