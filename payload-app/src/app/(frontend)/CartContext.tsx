'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext<any>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

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

    }, [])
    const updateQuantity = async (item: any, newQuantity: number) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lineItemId: item.id,
                    itemYrn: item.itemYrn,
                    priceId: item.price?.priceId,
                    priceAmount: item.price?.effectiveAmount ?? item.price?.originalAmount,
                    quantity: newQuantity,
                }),
            })

            if (!response.ok) throw new Error('Failed to update item quantity')

            const updatedCart = await response.json()
            setCart(updatedCart)
        } catch (error) {
            console.error('Error updating quantity:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const removeItem = async (item: any) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lineItemId: item.id }),
            })

            if (!response.ok) throw new Error('Failed to remove item')

            const updatedCart = await response.json()
            setCart(updatedCart)
        } catch (error) {
            console.error('Error removing item:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const clearCart = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            })

            if (!response.ok) throw new Error('Failed to clear cart')

            const updatedCart = await response.json()
            setCart(updatedCart)
        } catch (error) {
            console.error('Error clearing cart:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <CartContext.Provider value={{ cart, setCart, isLoading, updateQuantity, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    return useContext(CartContext);

}