'use client'

import Link from 'next/link'
import { useCart } from '../CartContext'

export default function CartPage() {
    const { cart, updateQuantity, removeItem, isLoading } = useCart() ?? {}

    const items = cart?.items ?? []
    const cartTotal = cart?.totalPrice ?? 0
    const currency = cart?.currency || 'EUR'

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
    }

    if (isLoading) {
        return (
            <main
                style={{
                    minHeight: '100vh',
                    backgroundColor: '#ffffff',
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '40px 16px',
                    textAlign: 'center',
                }}
            >
                <p
                    style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                >Loading your cart...</p>
            </main>
        )
    }

    if (items.length === 0) {
        return (
            <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '40px 16px', }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div
                        style={{
                            ...cardStyle,
                            padding: '48px 24px',
                            textAlign: 'center',
                        }}
                    >
                        <h1
                            style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#111827',
                                marginBottom: '8px',
                            }}>Your cart is empty</h1>
                        <p
                            style={{
                                color: '#6b7280',
                                fontSize: '14px',
                                marginBottom: '24px',
                            }}>You haven't added any books to your cart yet.</p>
                        <Link
                            href="/"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: '#4f46e5',
                                color: '#ffffff',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '600',
                            }}>Explore books →</Link>
                    </div>
                </div>
            </main>
        )
    }
    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '40px 16px', }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', }}>
                    <h1
                        style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: '#111827',
                            margin: 0,
                        }}>Your Shopping Cart</h1>
                    <span
                        style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            fontWeight: '500',
                        }}>{items.length}{' '}{items.length === 1 ? 'item' : 'items'}</span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        marginBottom: '32px',
                    }}
                >{items.map((item: any) => {
                    const priceAmount = item.price?.effectiveAmount ?? item.price?.originalAmount ?? 0
                    return (<div key={item.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', gap: '16px', flexWrap: 'wrap', }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <h3
                                style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#111827',
                                    margin: '0 0 4px 0',
                                    lineHeight: '1.3',
                                }}
                            >{item.name || 'Untitled Book'}
                            </h3>
                            <p
                                style={{
                                    margin: 0,
                                    color: '#16a34a',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                }}
                            > {priceAmount} {currency}
                                <span style={{ color: '#9ca3af', fontWeight: '400', }}>{' '}/ unit</span>
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', }}>
                            <button
                                type="button"
                                onClick={() => updateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
                                disabled={isLoading || item.quantity <= 1}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: isLoading || item.quantity <= 1 ? '#f3f4f6' : '#ffffff',
                                    color: isLoading || item.quantity ? '#9ca3af' : '#374151',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: isLoading || item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >-</button>
                            <span
                                style={{
                                    minWidth: '28px',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#111827',
                                }}>{item.quantity}</span>
                            <button
                                type="button"
                                onClick={() => updateQuantity?.(item.id, item.quantity + 1)}
                                disabled={isLoading}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: isLoading ? '#f3f4f6' : '#ffffff',
                                    color: isLoading ? '#9ca3af' : '#374151',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >+</button>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeItem?.(item.id)}
                            disabled={isLoading}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: isLoading ? '#9ca3af' : '#ef4444',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                                padding: '6px 12px',
                                borderRadius: '6px',
                            }}
                        > Remove </button>
                    </div>
                    )
                })}
                </div>

                <div style={{ ...cardStyle, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', display: 'block', marginBottom: '2px', }}>
                            Total Amount</span>

                    </div>

                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#4f46e5', }}>{cartTotal} {currency}</span>
                </div>
            </div>
        </main>
    )
}