import React, { useState, useContext, createContext} from "react";


const CheckoutContext = createContext();

export function CheckoutProvider({children}) {

  const [products, setProducts] = useState(
    JSON.parse(sessionStorage.getItem("products")) || []
  );
  const [totalItems, setTotalItems] = useState(
    JSON.parse(sessionStorage.getItem("totalItems")) || 0
  );

  const [totalPrice, setTotalPrice] = useState(
    JSON.parse(sessionStorage.getItem("totalPrice")) || 0
  );

  const [checkoutAddress, setCheckoutAddress] = useState(
    JSON.parse(sessionStorage.getItem("checkoutAddress")) || {}
  );

  const [paymentValid, setPaymentValid] = useState(false);

  const updateProducts = (newData) => {
    setProducts(newData);
    sessionStorage.setItem("products", JSON.stringify(newData));
  };

  const updateCheckoutAddress = (newData) => {
    setCheckoutAddress(newData);
    sessionStorage.setItem("checkoutAddress", JSON.stringify(newData));
  };

  const updatePaymentValid = (newData) => {
    setPaymentValid(newData);
  };

  const updateTotalItems = (newData) => {
    setTotalItems(newData);
    sessionStorage.setItem("totalItems", newData);
  };

  const updateTotalPrice = (newData) => {
    setTotalPrice(newData);
    sessionStorage.setItem("totalPrice", newData);
  };

  return (
    <CheckoutContext.Provider
      value={{
        paymentValid,
        products,
        totalItems,
        totalPrice,
        checkoutAddress,
        updatePaymentValid,
        updateCheckoutAddress,
        updateProducts,
        updateTotalItems,
        updateTotalPrice,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);

  return {
    products: context.products,
    totalItems: context.totalItems,
    totalPrice: context.totalPrice,
    checkoutAddress: context.checkoutAddress,
    paymentValid: context.paymentValid,
    updatePaymentValid: context.updatePaymentValid,
    updateCheckoutAddress: context.updateCheckoutAddress,
    updateProducts: context.updateProducts,
    updateTotalItems: context.updateTotalItems,
    updateTotalPrice: context.updateTotalPrice,
  };
}
