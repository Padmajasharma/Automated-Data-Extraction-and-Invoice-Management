import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {
    addProduct: (state, action) => {
      state.push(action.payload);
    },
    deleteProduct: (state, action) => {
      return state.filter((product) => product.id !== action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.findIndex((product) => product.id === action.payload.id); 
      if (index !== -1) {
        // Update the product at the found index with the new properties
        state[index] = {
          ...state[index], // Keep existing properties
          ...action.payload.updatedProduct // Override with updated properties
        };
      }
    },
    
  },
});

export const { addProduct, deleteProduct, updateProduct } = productsSlice.actions;

export const selectProductList = (state) => state.products;

export default productsSlice.reducer;
