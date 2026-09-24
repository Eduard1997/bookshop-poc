'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../CartContext';

export default function Login() {
    const router = useRouter();
    const {fetchCart, disableCart} = useCart()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    setLoading(true);
    setError('');

    try {
        const res = await fetch('http://localhost:3000/api/customers/me');
        const data = await res.json();
        
        if (data?.user) {
            await fetch('http://localhost:3000/api/customers/logout', { method: 'POST' });
            await disableCart?.();
        }
    } catch (err) {
        console.error('Auth check failed:', err);
    }

    try {
        const res = await fetch('http://localhost:3000/api/customers/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });


            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Failed to login');
                return;
            }

            await fetchCart(); 

            router.push('/');
            router.refresh(); 

        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }

    const handleGuestLogin = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/customers/me');
        const data = await res.json();
        
        if (data?.user) {
            await fetch('http://localhost:3000/api/customers/logout', { method: 'POST' });
            await disableCart?.();
        }
    } catch (err) {
        console.error('Failed to clear session:', err);
    } finally {
        router.push('/');
        router.refresh();
    }
}

    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#f9fafb', 
            boxSizing: 'border-box'
        }}>
            
            <a 
                href="/admin" 
                style={{
                    position: 'absolute',
                    top: '24px',
                    right: '32px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
                onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
            >
                Admin Portal &rarr;
            </a>

            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: '#ffffff',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', 
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                boxSizing: 'border-box',
                border: '1px solid #f3f4f6'
            }}>
                
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '36px', 
                        fontWeight: '800', 
                        color: '#7e22ce', 
                        letterSpacing: '-1px'
                    }}>
                        BookShop
                    </h1>
                    <p style={{ margin: 0, fontSize: '15px', color: '#6b7280' }}>
                        Sign in to manage your orders.
                    </p>
                </div>

                {error && (
                    <div style={{ 
                        backgroundColor: '#fef2f2', 
                        color: '#dc2626', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontSize: '14px', 
                        textAlign: 'center',
                        border: '1px solid #fee2e2'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="email" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                            Email
                        </label>
                        <input 
                            id="email"
                            type="email" 
                            name="email" 
                            placeholder="you@example.com" 
                            required 
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '15px',
                                outline: 'none',
                                color: '#111827'
                            }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="password" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                            Password
                        </label>
                        <input 
                            id="password"
                            type="password" 
                            name="password" 
                            placeholder="••••••••" 
                            required 
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '15px',
                                outline: 'none',
                                color: '#111827'
                            }}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            marginTop: '8px',
                            padding: '12px',
                            backgroundColor: loading ? '#a855f7' : '#7e22ce',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                    <span style={{ padding: '0 12px', color: '#9ca3af', fontSize: '14px' }}>or</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                </div>

                <button 
                    onClick={handleGuestLogin}
                    type="button"
                    style={{
                        padding: '12px',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                    }}
                >
                    Continue as a guest
                </button>

                <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Don't have an account?{' '}
                    <a href="/auth/register" style={{ color: '#7e22ce', textDecoration: 'none', fontWeight: '600' }}>
                        Register here
                    </a>
                </p>

            </div>
        </div>
    );
}
