import styled from 'styled-components';

interface IStyledLabelProps {
  hide?: boolean;
}

interface IStyledSelectProps {
  error?: boolean;
}

export const StyledSelectInput = styled.select<IStyledSelectProps>`
  position: relative;
  appearance: none;
  margin: 1rem 0;
  padding: 1rem;
  font-size: 1.6rem;
  min-width: 30rem;
  border: 1px solid
    ${({ theme, error }) => (error ? "red" : theme.colors.dark.darker)};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background: ${({ theme }) => theme.colors.dark.default};
  color: ${({ theme }) => theme.colors.light.default};

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.primary.default};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.phone}) {
    min-width: unset;
    display: block;
    width: 100%;
  }
`;

export const SelectInputToggleIcon = styled.span`
  position: absolute;
  left: 90%;
  bottom: 4.8rem;
  font-size: 2rem;
  height: 0;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary.default};
  }
`;

export const StyledLabel = styled.label<IStyledLabelProps>`
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};
  height: ${({ hide }) => (hide ? "0px" : "auto")};
`;
