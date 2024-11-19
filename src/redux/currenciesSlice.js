// currenciesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const currenciesSlice = createSlice({
  name: "currencies",
  initialState: {
    currencies: [],
    selectedCurrency: "INR", // Default selected currency
  },
  reducers: {
    setCurrencies: (state, action) => {
      state.currencies = action.payload;
    },
    changeCurrency: (state, action) => {
      state.selectedCurrency = action.payload;
    },
  },
});

export const { setCurrencies, changeCurrency } = currenciesSlice.actions;

export default currenciesSlice.reducer;
