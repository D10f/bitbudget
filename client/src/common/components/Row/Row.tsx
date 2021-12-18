import React from "react";
import styled from "styled-components";

interface IRowProps {
  children: React.ReactChild | React.ReactChild[];
  marginless?: boolean;
  gap?: number;
}

const StyledRow = styled.div<IRowProps>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: ${({ gap }) => gap + 'rem'};;
  margin-top: ${({ marginless }) => marginless ? '0' : '2rem'};
`;

const Row = ({ children, gap = 2, marginless = false }: IRowProps) => {
  return <StyledRow gap={gap} marginless={marginless}>{children}</StyledRow>;
};

export default Row;
