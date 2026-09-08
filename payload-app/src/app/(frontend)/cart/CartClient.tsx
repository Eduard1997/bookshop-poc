'use client'

import { useState } from 'react'
import { useCart } from '../CartContext'
import EmptyCart from './EmptyCart'
import Link from 'next/link'

interface CartClientProps {
    initialItems: any[]
    cartTotal: number | string
    currency: string
}

export default function CartClient({ initialItems, cartTotal, currency }: CartClientProps) {
    const { updateQuantity, removeItem, clearCart, isLoading, cart } = useCart() ?? {}

    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const currentItems = cart
        ? cart.items.map((cartItem: any) => {
            const matchingInitial = initialItems.find(i => i.id === cartItem.id)
            return {
                ...cartItem,
                bookDetails: matchingInitial?.bookDetails || cartItem.bookDetails
            }
        })
        : initialItems

    const handleIncrement = async (item: any, currentQuantity: number) => {
        if (!updateQuantity || isLoading) return
        setUpdatingId(item.id)
        try {
            await updateQuantity(item, currentQuantity + 1)
        } catch (error) {
            console.error('Error incrementing quantity:', error)
        } finally {
            setUpdatingId(null)
        }
    }

    const handleDecrement = async (item: any, currentQuantity: number) => {
        if (!updateQuantity || isLoading || currentQuantity <= 1) return
        setUpdatingId(item.id)
        try {
            await updateQuantity(item, currentQuantity - 1)
        } catch (error) {
            console.error('Error decrementing quantity:', error)
        } finally {
            setUpdatingId(null)
        }
    }

    const handleRemove = async (item: any) => {
        if (!removeItem || isLoading) return
        setUpdatingId(item.id)
        try {
            await removeItem(item)
        } catch (error) {
            console.error('Error removing item:', error)
        } finally {
            setUpdatingId(null)
        }
    }

    const handleClearCart = async () => {
        if (!clearCart || isLoading) return
        try {
            await clearCart()
        } catch (error) {
            console.error('Error clearing cart:', error)
        }
    }

    const emporixTotal = cart ? (cart.totalPrice?.amount ?? 0) : cartTotal
    const totalUnitsCount = cart?.totalUnitsCount ?? 0

    if (currentItems.length === 0) {
        return <EmptyCart />
    }

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '60px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ maxWidth: '840px', margin: '0 auto' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#5145cd', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                            Shopping Cart
                        </h1>
                        <p style={{ margin: 0, fontSize: '15px', color: '#64748b' }}>
                            Review your items before proceeding to checkout.
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                            style={{
                                backgroundColor: '#e0e7ff',
                                color: '#5145cd',
                                padding: '8px 18px',
                                borderRadius: '20px',
                                fontSize: '13px',
                                fontWeight: '700',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: '1'
                            }}
                        >{totalUnitsCount} {totalUnitsCount === 1 ? 'item' : 'items'}</span>

                        <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1' }} />

                        <button
                            type="button"
                            onClick={handleClearCart}
                            disabled={isLoading}
                            style={{
                                backgroundColor: '#e2e8f0',
                                color: '#334155',
                                border: 'none',
                                padding: '8px 18px',
                                borderRadius: '20px',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1,
                                transition: 'all 0.2s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: '1'
                            }}
                        >Clear cart</button>
                    </div>

                </div>


                <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
                    {currentItems.map((item: any) => {
                        const title = item.bookDetails?.title || 'Unknown Book'
                        const coverImageUrl = item.bookDetails?.coverImageUrl
                        const isThisItemBusy = isLoading || updatingId === item.id

                        const emporixUnitPrice =
                            item.price?.effectiveAmount ??
                            item.price?.originalAmount ??
                            item.price?.amount ??
                            item.unitPrice ??
                            20

                        const itemCurrency = item.price?.currency || cart?.currency || currency

                        return (
                            <div
                                key={item.id}
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    padding: '20px',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto auto',
                                    alignItems: 'center',
                                    gap: '24px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
                                    opacity: isThisItemBusy ? 0.6 : 1,
                                    transition: 'opacity 0.2s'
                                }}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                                    {coverImageUrl ? (
                                        <img
                                            src={coverImageUrl}
                                            alt={title}
                                            style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        />
                                    ) : (
                                        <div style={{ width: '60px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'grid', placeItems: 'center', color: '#94a3b8', fontSize: '11px' }}>
                                            No Cover
                                        </div>
                                    )}

                                    <div style={{ minWidth: 0 }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {title}
                                        </h3>

                                        <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: '600' }}>
                                            {emporixUnitPrice} {itemCurrency} / unit
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
                                        quantity
                                    </span>
                                    <div
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            backgroundColor: '#ffffff',
                                            height: '36px'
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => handleDecrement(item, item.quantity)}
                                            disabled={isThisItemBusy || item.quantity <= 1}
                                            style={{
                                                width: '32px',
                                                height: '100%',
                                                border: 'none',
                                                background: 'transparent',
                                                color: (item.quantity <= 1 || isThisItemBusy) ? '#cbd5e1' : '#0f172a',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                cursor: (item.quantity <= 1 || isThisItemBusy) ? 'not-allowed' : 'pointer',
                                                display: 'grid',
                                                placeItems: 'center',
                                                outline: 'none',
                                                boxShadow: 'none'
                                            }}
                                        > − </button>
                                        <span
                                            style={{
                                                width: '36px',
                                                textAlign: 'center',
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                color: '#0f172a',
                                                userSelect: 'none'
                                            }}
                                        >{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleIncrement(item, item.quantity)}
                                            disabled={isThisItemBusy}
                                            style={{
                                                width: '32px',
                                                height: '100%',
                                                border: 'none',
                                                background: 'transparent',
                                                color: isThisItemBusy ? '#cbd5e1' : '#0f172a',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                cursor: isThisItemBusy ? 'not-allowed' : 'pointer',
                                                display: 'grid',
                                                placeItems: 'center',
                                                outline: 'none',
                                                boxShadow: 'none'
                                            }}
                                        > + </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemove(item)}
                                    disabled={isThisItemBusy}
                                    title="Remove item"
                                    style={{
                                        background: '#fef2f2',
                                        border: '1px solid #fee2e2',
                                        color: '#ef4444',
                                        cursor: isThisItemBusy ? 'not-allowed' : 'pointer',
                                        borderRadius: '8px',
                                        padding: '0 12px',
                                        height: '36px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <span>Remove</span>
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        )
                    })}
                </div>

                <div
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        padding: '24px 32px',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        alignItems: 'center',
                        gap: '24px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                    }}
                >
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                            Total Amount
                        </span>
                        <div style={{ fontSize: '30px', fontWeight: '800', color: '#5145cd', lineHeight: '1' }}>
                            {emporixTotal} <span style={{ fontSize: '18px', fontWeight: '600', color: '#5145cd' }}>{currency}</span>
                        </div>
                    </div>

                    <Link
                        href="/checkout"
                        style={{
                            backgroundColor: '#5145cd',
                            color: '#ffffff',
                            padding: '14px 28px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontSize: '15px',
                            fontWeight: '600',
                            boxShadow: '0 4px 12px rgba(81, 69, 205, 0.25)',
                            display: 'inline-block'
                        }}
                    >Proceed to Checkout →</Link>
                </div>

            </div>
        </main>
    )
}