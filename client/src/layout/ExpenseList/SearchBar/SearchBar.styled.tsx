import styled from 'styled-components';

export const StyledContainer = styled.aside`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 90%;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark.darkest}; ;
  overflow: hidden;
  position: relative;
  margin-left: 2rem;

  div {
    position: absolute;
    top: 25%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 200%;
    transition: all 250ms 500ms ease;
    will-change: top;
  }

  &:hover div {
    top: -100%;
  }
`;

export const StyledLabel = styled.label`
  padding: 0 1rem;

  svg {
    width: 2rem;
    height: 2rem;
    fill: ${({ theme }) => theme.colors.light.darker};
  }
`;

export const StyledInput = styled.input`
  display: inline-block;
  background: none;
  color: inherit;
  font-size: 1.6rem;
  width: 100%;
  padding: 1rem 4rem;
  border: none;
`;
