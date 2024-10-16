import { configureStore } from "@reduxjs/toolkit";
import layoutReducer, { apperanceTheme } from "./slice";
import {
  accordionReducer,
  apperanceReducer,
  hierarchyEMployee,
} from "./reducers/reducers";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
export const store = configureStore({
  reducer: {
    layout: layoutReducer,
    accordion: accordionReducer,
    hirearchy: hierarchyEMployee,
  },
});

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, apperanceTheme);

// const store = configureStore({
//   reducer: persistedReducer,
//   layout: layoutReducer,
//   accordion: accordionReducer,
//   hirearchy: hierarchyEMployee,
// });

// const persistor = persistStore(store);

// export { store, persistor, Provider, PersistGate };
