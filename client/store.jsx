import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import root from "./reducer";

const middleware = [thunk];

const persistConfig = {
  key: "authType",
  storage: storage,
  whitelist: ["products","modal"],
};

const PersistReducer = persistReducer(persistConfig, root);

export const store = createStore(
  PersistReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);

/* 

 */
