import React, { createContext, useContext, useState } from "react";

const cartNumberContext = createContext();

export function CartNumberProvider({ children }) {
  const [cartNumbers, setCartNumbers] = useState(
    parseInt(sessionStorage.getItem("cartItemNums")) || 0
  );
  const [wishlistNumbers, setWishlistNumbers] = useState(
    parseInt(sessionStorage.getItem("wishlistNumbers")) || 0
  );

  const updateCartNumber = (newNum) => {
    setCartNumbers(newNum);
    sessionStorage.setItem("cartItemNums", newNum);
  };

  const updateWishlistNumbers = (newNum) => {
    setWishlistNumbers(newNum);
    sessionStorage.setItem("wishlistNumbers", newNum);
  };

  return (
    <cartNumberContext.Provider
      value={{
        cartNumbers,
        updateCartNumber,
        wishlistNumbers,
        updateWishlistNumbers,
      }}
    >
      {children}
    </cartNumberContext.Provider>
  );
}

export function useCartNumbers() {
  const context = useContext(cartNumberContext);
  console.log("context", context);
  return context.cartNumbers;
}

export function useUpdateCartNumbers() {
  const context = useContext(cartNumberContext);
  return context.updateCartNumber; // Return the function itself, not a property of the function
}

export function useWishlistNumbers() {
  const context = useContext(cartNumberContext);
  return context.wishlistNumbers;
}

export function useUpdateWishlistNumbers() {
  const context = useContext(cartNumberContext);
  return context.updateWishlistNumbers; // Return the function itself, not a property of the function
}
