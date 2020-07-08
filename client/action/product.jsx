import {
  ALL_PRODUCT,
  DELETE_PRODUCT,
  FILTER_PRODUCT,
  CLEAR_FILTER,
} from "./Types";

export const allProduct = (product) => (dispatch) => {
  return dispatch({
    type: ALL_PRODUCT,
    payload: product,
  });
};

export const deleteProduct = (productId) => (dispatch) => {
  return dispatch({
    type: DELETE_PRODUCT,
    payload: productId,
  });
};

export const filterProduct = (searchInput) => (dispatch) => {
  return dispatch({
    type: FILTER_PRODUCT,
    payload: searchInput,
  });
};

export const clearFilter = () => (dispatch) => {
  return dispatch({
    type: CLEAR_FILTER,
  });
};

