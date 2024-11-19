import { combineReducers } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice";
import productsReducer from "./productsSlice"; // Import the products slice
import currenciesReducer from "./currenciesSlice";

const rootReducer = combineReducers({
  invoices: invoicesReducer,
  products: productsReducer, // Add products reducer
  currencies: currenciesReducer,
});

export default rootReducer;
