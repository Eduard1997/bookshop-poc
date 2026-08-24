'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext<any>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<any>(null)

    useEffect(() => {
        const fetchInitialCart = async () => {
            try {
                const response = await fetch('/api/cart')
                const data = await response.json()
                setCart(data)
            } catch (error) {
                console.error('Error fetching cart:', error)
            }
        }

        fetchInitialCart()
        
    },[])

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    return useContext(CartContext);

}