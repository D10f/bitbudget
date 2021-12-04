import React from "react";
import styled from "styled-components";

interface IColProps {
  children: React.ReactChild | React.ReactChild[];
  marginless?: boolean;
  gap?: number;
}

const StyledCol = styled.div<IColProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: ${({ gap }) => gap ? '2rem' : '0'};
  margin-top: ${({ marginless }) => marginless ? '0' : '2rem'};
`;

const Col = ({ children, gap, marginless = false }: IColProps) => {
  return <StyledCol gap={gap} marginless>{children}</StyledCol>;
};

export default Col;
