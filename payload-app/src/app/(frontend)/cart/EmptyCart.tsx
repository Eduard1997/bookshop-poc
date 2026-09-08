import Link from 'next/link'

export default function EmptyCart() {
    return (
        <main style={{ minHeight: '80vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #eaecf0', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', maxWidth: '420px', width: '100%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#111827' }}>
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
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>
                    Your cart is empty.
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5', margin: '0 0 24px' }}>
                    You haven't added any books to your cart yet. Explore our catalog to find your favorite titles.
                </p>
                <Link href="/books" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4f46e5', color: '#ffffff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', width: '100%', boxSizing: 'border-box' }}>
                    Explore books →
                </Link>
            </div>
        </main>
    )
}