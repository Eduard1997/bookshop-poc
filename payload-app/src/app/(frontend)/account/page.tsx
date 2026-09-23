import Link from 'next/link'

export default function AccountLanding() {
    return (
        <main
            style={{
                minHeight: '80vh',
                backgroundColor: '#fafafa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
        >
            <div
                style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaecf0',
                    borderRadius: '20px',
                    padding: '40px 32px',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '100%',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                }}
            >
                {/* Cercul cu iconița de User */}
                <div
                    style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        color: '#111827',
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
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>

                {/* Titlu */}
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>
                    Your Account
                </h2>

                {/* Text descriere */}
                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5', margin: '0 0 24px' }}>
                    Log in to access your saved orders, manage your profile, and fast-track your checkout.
                </p>

                {/* Container acțiuni compactat */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* 1. Butonul principal Log in */}
                    <Link
                        href="/login"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#4f46e5',
                            color: '#ffffff',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            width: '100%',
                            boxSizing: 'border-box',
                            boxShadow: '0 2px 4px rgba(79, 70, 229, 0.15)',
                        }}
                    >
                        Log in →
                    </Link>

                    {/* 2. Separatorul subțire or */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '2px 0',
                            color: '#9ca3af',
                            fontSize: '12px',
                        }}
                    >
                        <div style={{ flex: 1, borderBottom: '1px solid #f3f4f6' }} />
                        <span style={{ padding: '0 10px', color: '#9ca3af', fontWeight: '500' }}>or</span>
                        <div style={{ flex: 1, borderBottom: '1px solid #f3f4f6' }} />
                    </div>

                    {/* 3. Continue as guest */}
                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ffffff',
                            color: '#374151',
                            border: '1px solid #e5e7eb',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            width: '100%',
                            boxSizing: 'border-box',
                        }}
                    >
                        Continue as guest
                    </Link>

                    {/* 4. Subsol cu opțiunea de Înregistrare */}
                    <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
                        Don't have an account?{' '}
                        <Link
                            href="/register"
                            style={{
                                color: '#4f46e5',
                                fontWeight: '600',
                                textDecoration: 'none',
                            }}
                        >
                            Register now
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}