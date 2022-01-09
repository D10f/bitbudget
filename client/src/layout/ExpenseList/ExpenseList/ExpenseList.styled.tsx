import styled from "styled-components";

export const StyledContainer = styled.aside`
  grid-area: expenses;
  overflow-y: auto;
  overflow-x: overlay;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tabletLandscape}) {
    overflow-y: unset;
    overflow-x: unset;
  }
`;

export const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-right: 2rem;
  margin-left: 1rem;
  padding-bottom: 2rem;
  /* max-width: 35rem; */

  @media (max-width: ${({ theme }) => theme.breakpoints.tabletLandscape}) {
    margin-left: 0;
    margin-right: 0;
  }
`;
