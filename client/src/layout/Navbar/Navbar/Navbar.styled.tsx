import styled from 'styled-components';

export const Nav = styled.nav`
  grid-area: navbar;
  width: 10rem;
  border: 1px solid rgba(10, 10, 10, 0.1);
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  border-radius: ${({ theme }) => theme.layout.borderRadius};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    height: 10rem;
  }
`;

export const NavbarMenu = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
  padding: 2rem 0;
  height: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
    padding: 0 2rem;
  }
`;