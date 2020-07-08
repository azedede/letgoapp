import { RETURN_MESSAGE, CLEAR_MESSAGE } from "./Types";

export const returnMessage = (msg, status, timeout = 5000) => (dispatch) => {
  setTimeout(()=>{
    dispatch({type:CLEAR_MESSAGE})
  },timeout)

  return dispatch({
    type: RETURN_MESSAGE,
    payload: { msg: msg, status: status }
  });
};

export const clearMessage = () => {
  return {
    type: CLEAR_MESSAGE
  };
};
