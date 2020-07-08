import {
  ALL_PRODUCT,
  DELETE_PRODUCT,
  FILTER_PRODUCT,
  CLEAR_FILTER,
} from "../action/Types";

const initialState = {
  products: [],
  filteredProduct: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ALL_PRODUCT:
      return {
        ...state,
        products: action.payload,
      };

    case DELETE_PRODUCT: {
      const filteredProduct = state.products.filter(
        (prod) => prod.id !== action.payload
      );
      return {
        ...state,
        products: filteredProduct,
      };
    }

    case FILTER_PRODUCT:
      if(action.payload.length === 1)return{
        ...state,
        filteredProduct:[]
      }
      console.log(action.payload);
      
      return {
        ...state,
        filteredProduct: state.products.filter((prod) => {
          const regex = new RegExp(`${action.payload}`, "gi");
          return prod.title.match(regex) || prod.description.match(regex);
        }),
      };
               
    case CLEAR_FILTER:
      return {
        ...state,
        filteredProduct: [],
      };

    default:
      return state;
  }
};
