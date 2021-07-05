import { ADD_QUERY, REMOVE_QUERY, UPDATE_QUERIES } from '../actionTypes';

export const addQuery = (query = '', value = []) => ({
  type: ADD_QUERY,
  payload: {
    key: query,
    value
  }
});

export const removeQuery = (query = '') => ({
  type: REMOVE_QUERY,
  payload: query
});

export const updateQueries = (queries = {}) => ({
  type: UPDATE_QUERIES,
  payload: queries
});

export const startUpdateQueries = (queries = {}) => {
  return (dispatch) => new Promise(resolve => {
    dispatch(updateQueries(queries));
    resolve();
  })
}

export const getQueriesForRanges = (queries = {}, ranges = []) => {
  return ranges.map(range => queries[range]).flat();
};
