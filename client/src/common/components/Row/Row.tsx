import React from "react";
import { StyledRow, IRowProps } from "./Row.styled";


const Row = ({ children, gap = 2, marginless = false }: IRowProps) => {
  return <StyledRow gap={gap} marginless={marginless}>{children}</StyledRow>;
};

export default Row;
