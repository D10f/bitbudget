import numeral from 'numeral';

export const formatAsCurrency = amount => {
  return numeral(amount / 100).format(`0,0.00`);
};
