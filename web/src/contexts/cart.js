"use client"

import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState({});
  const [itemNumber, setItemNumber] = useState(0);
  const [itemsPrice, setItemsPrice] = useState(0);
  const [freightPrice, setFreightPrice] = useState(0);

  function addItem(item) {
    setFreightPrice(4 * parseInt(Math.log2(itemNumber + 2 + 1)));
    setItemsPrice(itemsPrice + item.price);
    setItemNumber(itemNumber + 1);
    const newItems = { ...items };
    if (newItems[item.brownieName]) {
      newItems[item.brownieName] = {
        ...newItems[item.brownieName],
        quantidade: newItems[item.brownieName].quantidade + 1,
      };
    } else {
      newItems[item.brownieName] = {
        quantidade: 1,
        data: { ...item },
      };
    }
    setItems(newItems);
  }

  function removeItem(item) {
    const newItems = { ...items };
    if (newItems[item.brownieName].quantidade > 1) {
      newItems[item.brownieName] = {
        ...newItems[item.brownieName],
        quantidade: newItems[item.brownieName].quantidade - 1,
      };
    }
    else {
      if (!confirm("Deseja realmente remover " + item.brownieName + " do carrinho?")) { return }
      delete newItems[item.brownieName];
    }
    setFreightPrice(4 * parseInt(Math.log2(itemNumber + 2 + 1)));
    setItemsPrice(itemsPrice - item.price);
    setItemNumber(itemNumber - 1);
    setItems(newItems);
  }

  function clearCart() {
    setFreightPrice(0);
    setItemsPrice(0);
    setItemNumber(0);
    setItems({});
  }

  return (
    <CartContext.Provider
      value={{ items, itemsPrice, itemNumber, freightPrice, addItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}