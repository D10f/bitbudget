import styled from "styled-components";
import Icon from "../../Icon/Icon";

interface ITextAreaStyleProps {
  error?: boolean;
  autocomplete: "on" | "off";
}

interface ILabelStyleProps {
  hide?: boolean;
}

export const StyledTextArea = styled.textarea<ITextAreaStyleProps>`
  margin: 1rem 0;
  padding: 1rem;
  font-size: 1.6rem;
  max-height: 30rem;
  min-width: 30rem;
  height: auto;
  outline: none;
  border: none;
  border: 1px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.light.default)};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background: ${({ theme }) => theme.colors.dark.default};
  color: ${({ theme }) => theme.colors.light.default};
  resize: vertical;

  @media (max-width: ${({ theme }) => theme.breakpoints.phone}) {
    min-width: unset;
    width: 100%;
  }
`;

export const StyledLabel = styled.label<ILabelStyleProps>`
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};
  height: ${({ hide }) => (hide ? "0px" : "auto")};
`;

export const StyledIcon = styled(Icon)`
  position: absolute;
  top: 4.7rem;
  right: 1.6rem;
  width: 1.6rem;
  height: 1.6rem;
  fill: ${({ theme }) => theme.colors.error};
`;

export const StyledSpan = styled.span`
  color: lightgray;
  font-size: 1.2rem;
`;