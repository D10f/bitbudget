import styled from "styled-components";

export const DashboardContainer = styled.section`
  grid-area: dashboard;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  // These three account for some overflow that crops the shadows
  margin-left: -1rem;
  padding-right: 1rem;
  padding-bottom: 2rem;

  overflow-y: auto;
  overflow-x: overlay;
  
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${({theme}) => theme.breakpoints.tabletPortrait}) {
    margin-left: 0;
    padding-right: 0;

    overflow-y: unset;
    overflow-x: unset;
  }
`;
