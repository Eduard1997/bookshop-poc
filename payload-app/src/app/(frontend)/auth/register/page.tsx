'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const registerRes = await fetch('http://localhost:3000/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const registerData = await registerRes.json();

            if (!registerRes.ok) {
                const errorMsg = registerData.errors?.[0]?.message || registerData.message || 'Failed to register';
                setError(errorMsg);
                setLoading(false);
                return;
            }

            router.push('/auth/login');
            router.refresh(); 

        } catch (err) {
            console.error('Registration error:', err);
            setError('An unexpected error occurred.');
            setLoading(false);
        }
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#f9fafb',
            boxSizing: 'border-box'
        }}>
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
                        Create an account to track your orders.
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

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Already have an account?{' '}
                    <a href="/login" style={{ color: '#7e22ce', textDecoration: 'none', fontWeight: '600' }}>
                        Sign in
                    </a>
                </p>

            </div>
        </div>
    );
}