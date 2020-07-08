import { CLEAR_MESSAGE, RETURN_MESSAGE } from "../action/Types";

const initialState = {
  msg: null,
  status: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RETURN_MESSAGE:
      return {
        ...state,
        msg: action.payload.msg,
        status: action.payload.status,
      };

    case CLEAR_MESSAGE:
      return {
        ...state,
        msg: null,
        status: null,
      };

    default:
      return state;
  }
};
