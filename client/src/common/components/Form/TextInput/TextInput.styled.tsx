import styled, { css } from "styled-components";
import Icon from "../../Icon/Icon";

interface IStyledLabelProps {
  hide?: boolean;
  required?: boolean;
}

interface IStyledInputProps {
  error?: boolean;
}

export const StyledInput = styled.input<IStyledInputProps>`
  position: relative;
  margin: 1rem 0;
  padding: 1rem;
  font-size: 1.6rem;
  min-width: 30rem;
  outline: none;
  border: none;
  border: 1px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.light.default)};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background: ${({ theme }) => theme.colors.dark.default};
  color: ${({ theme }) => theme.colors.light.default};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.phone}) {
    min-width: unset;
    width: 100%;
  }
`;

export const StyledIcon = styled(Icon)`
  position: absolute;
  top: 4.7rem;
  right: 1.6rem;
  width: 1.6rem;
  height: 1.6rem;
  fill: ${({ theme }) => theme.colors.error};
`;

export const StyledLabel = styled.label<IStyledLabelProps>`
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};
  height: ${({ hide }) => (hide ? "0px" : "auto")};

  ${({ required }) => !required && css`
    &::after {
      content: '(optional)';
      margin-left: 0.25rem;
      font-size: 1.2rem;
    }
  `}
`;