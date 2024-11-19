import { useSelector, useDispatch  } from "react-redux";
import { selectInvoiceList } from "./invoicesSlice";
import { selectProductList } from "./productsSlice";
import { setCurrencies, changeCurrency } from "./currenciesSlice";

export const useInvoiceListData = () => {
  const invoiceList = useSelector(selectInvoiceList);

  const getOneInvoice = (receivedId) => {
    return (
      invoiceList.find(
        (invoice) => invoice.id.toString() === receivedId.toString()
      ) || null
    );
  };

  const listSize = invoiceList.length;

  return {
    invoiceList,
    getOneInvoice,
    listSize,
  };
};


export const useProductListData = () => {
  const productList = useSelector(selectProductList); // Get the product list from the store

  const getOneProduct = (receivedId) => {
    return (
      productList.find(
        (product) => product.id.toString() === receivedId.toString()
      ) || null
    );
  };

  const listSize = productList.length; // Get the size of the product list

  return {
    productList,
    getOneProduct,
    listSize,
  };
};


export const useCurrencyData = () => {
  const dispatch = useDispatch();
  
  const currencies = useSelector((state) => state.currencies.currencies);
  const selectedCurrency = useSelector((state) => state.currencies.selectedCurrency);

  const updateCurrencies = (currencyList) => {
    dispatch(setCurrencies(currencyList));
  };

  const selectCurrency = (currencyCode) => {
    dispatch(changeCurrency(currencyCode));
  };

  return {
    currencies,
    selectedCurrency,
    updateCurrencies,
    selectCurrency,
  };
};



