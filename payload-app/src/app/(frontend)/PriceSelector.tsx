'use client'

import React, { useState } from 'react'
import { useCart } from './CartContext'


export default function PriceSelector({ prices, availability, itemYrn }: { prices: any[]; availability?: any; itemYrn?: string }) {
    const { cartId, setCart } = useCart() ?? {}
    const cartContext = useCart()
    const [loading, setLoading] = useState(false)

    const uniquePrices = Array.from(new Map((prices || []).map(p => [p.country, p])).values())

    const [selectedCountry, setSelectedCountry] = useState(uniquePrices?.[0]?.country || '')
    const currentPrice = uniquePrices.find(p => p.country === selectedCountry) || uniquePrices?.[0]

    async function handleAddToCart() {
        if (!itemYrn) {
            alert('Produsul nu are un identificator valid.')
            return
        }

        if (!currentPrice) {
            alert('Nu există preț disponibil pentru acest produs.')
            return
        }

        if (!currentPrice.id) {
            console.error('currentPrice fără id:', currentPrice)
            alert('Preț invalid — lipsește id-ul prețului.')
            return
        }

        if (!availability?.available) {
            alert('Produsul nu este momentan în stoc.')
            return
        }

        setLoading(true)

        try {
            console.log(currentPrice.amount)
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemYrn: itemYrn,
                    priceId: currentPrice.id,
                    priceAmount: currentPrice.amount,
                    quantity: 1
                })
            })

            const data = await response.json().catch(() => null)

            if (!response.ok) {
                alert(`Eroare: ${data?.error || 'Nu s-a putut adăuga în coș'}`)
                return
            }

            if (cartContext?.setCart) {
                cartContext.setCart(data)
            }

            alert('Produs adăugat cu succes în coș!')
        } catch (error) {
            console.error('Error adding to cart:', error)
            alert('A apărut o eroare neașteptată.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</div>
                        {uniquePrices && uniquePrices.length > 1 && (
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', color: '#111827', outline: 'none', cursor: 'pointer', fontWeight: '500' }}
                            >
                                {uniquePrices.map((price: any) => (
                                    <option key={price.country} value={price.country}>
                                        Ship to: {price.country}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    {currentPrice ? (
                        <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827' }}>
                            {currentPrice.amount} {currentPrice.currency}
                        </div>
                    ) : (
                        <div style={{ fontSize: '20px', fontWeight: '600', color: '#9ca3af' }}>Unavailable</div>
                    )}
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Availability</div>
                    {availability?.available ? (
                        <div style={{ color: '#16a34a', fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#16a34a', borderRadius: '50%' }}></span>
                            In Stock ({availability.stockLevel})
                        </div>
                    ) : (
                        <div style={{ color: '#dc2626', fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#dc2626', borderRadius: '50%' }}></span>
                            Out of Stock
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={loading || !currentPrice || !availability?.available}
                    style={{
                        width: '100%',
                        padding: '12px 24px',
                        fontSize: '15px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: (loading || !currentPrice || !availability?.available) ? 'not-allowed' : 'pointer',
                        backgroundColor: (loading || !currentPrice || !availability?.available) ? '#d1d5db' : '#4f46e5',
                        color: (loading || !currentPrice || !availability?.available) ? '#9ca3af' : '#ffffff',
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: (loading || !currentPrice || !availability?.available) ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                    }}
                >{loading ? 'Adding to cart...' : 'Add to Cart'}</button>

            </div>
        </div>
    )
}