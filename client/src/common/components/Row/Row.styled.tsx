import styled from 'styled-components';

export interface IRowProps {
  children: React.ReactChild | React.ReactChild[];
  marginless?: boolean;
  gap?: number;
}

export const StyledRow = styled.div<IRowProps>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: ${({ gap }) => gap + 'rem'};;
  margin-top: ${({ marginless }) => marginless ? '0' : '2rem'};
`;