import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    console.log('Result data changed:', resultData);
  }, [resultData]);

  function signInContext(token, userName) {
    setUser(userName);
    setToken(token);
    console.log('User signed in. Token:', token);
  }

  function signOutContext() {
    setUser(null);
    setToken(null);
    setCart([]);
    setResultData(null);
    console.log('User signed out. Token cleared.');
  }

  const value = {
    user,
    token,
    cart,
    resultData,
    isUserLoggedIn: !!token, // Check if token is present
    signInContext,
    signOutContext,
    updateCart: setCart,
    updateResultData: setResultData,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
