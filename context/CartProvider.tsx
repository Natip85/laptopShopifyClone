"use client"

import { CartContextProvider } from "@/hooks/useCart";

interface CartProviderProps{
  children: React.ReactNode

}

const CartProvider = ({children}:CartProviderProps) => {
  return ( 
    <CartContextProvider>
      {children}
    </CartContextProvider>
   );
}
 
export default CartProvider;