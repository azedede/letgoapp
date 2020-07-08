import { AGREEMENT } from "../action/Types";

const initialProps = {
  agreement: true
};

export const modal = (state = initialProps, action) => {
  switch (action.type) {
    case AGREEMENT:
      return {
        ...state,
        agreement: action.payload,
      };

    default:
      return state;
  }
};
