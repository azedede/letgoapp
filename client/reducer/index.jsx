import { combineReducers } from "redux";
import errorResponse from "./error";
import allProducts from "./product";
import {modal} from './modal'


export default combineReducers({
  message: errorResponse,
  products: allProducts,
  modal: modal
});
