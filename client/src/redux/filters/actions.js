import * as actions from './types';

export const setCurrentMonth = month => ({
  type: actions.SET_CURRENT_MONTH,
  payload: month
});

// export const setTextFilter = (text = '') => ({
//   type: actions.SET_TEXT_FILTER,
//   payload: text
// });
//
// export const setStartDate = (startDate) => ({
//   type: actions.SET_START_DATE,
//   payload: startDate
// });
//
// export const setEndDate = (endDate) => ({
//   type: actions.SET_END_DATE,
//   payload: endDate
// });
//
// export const switchSortOrder = () => ({
//   type: actions.SWITCH_SORT_ORDER
// });
//
// export const sortExpenses = (value) => {
//   switch (value) {
//     case 'amount':
//       return {
//         type: actions.SORT_BY_AMOUNT
//       };
//     case 'createdAt':
//       return {
//         type: actions.SORT_BY_DATE
//       };
//     case 'title':
//       return {
//         type: actions.SORT_BY_TITLE
//       };
//     case 'category':
//       return {
//         type: actions.SORT_BY_CATEGORY
//       };
//     default:
//       return {
//         type: actions.SORT_BY_DATE
//       };
//   };
// };
