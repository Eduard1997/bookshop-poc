'use client'

import Link from 'next/link'
import { useCart } from './CartContext'

export function HeaderCartIcon() {
    const { cart } = useCart() ?? {}
    const itemCount = cart?.lineItems?.length ?? cart?.items?.length ?? cart?.totalItems ?? 0

    return (
        <Link
            href="/cart"
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit'
            }}
        >
            <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>

            {itemCount > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    lineHeight: '1',
                    boxShadow: '0 0 0 2px #111111'
                }}>{itemCount}</span>
            )}
        </Link>
    )
}