import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  function addToCart(item, quantity) {
    setCart((prevCart) => {
      const itemExists = prevCart.find((cartItem) => cartItem.name === item.name);
  
      if (itemExists) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });
  }

  const resetCart = () => {
    setCart([]);
  };

  const removeFromCart = (itemToRemove) => {
    setCart((currentCart) => currentCart.filter(item => item.id !== itemToRemove.id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};