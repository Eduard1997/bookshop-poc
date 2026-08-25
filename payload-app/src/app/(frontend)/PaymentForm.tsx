'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import mockPayment from '@/lib/mockPayment'

export default function PaymentForm({ cartId }: { cartId: string }) {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        
        await mockPayment(cartId)
        router.push('/confirmation?orderId=ORD-12345')
    }

    const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', marginBottom: '16px', boxSizing: 'border-box' as const };

    return (
        <form onSubmit={handlePay} style={{ backgroundColor: '#f9fafb', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Payment Details</h2>
            
            <input type="text" placeholder="Card Number (Fake Data Accepted)" required style={inputStyle} />
            
            <div style={{ display: 'flex', gap: '16px' }}>
                <input type="text" placeholder="MM/YY" required style={inputStyle} />
                <input type="text" placeholder="CVC" required style={inputStyle} />
            </div>

            <button 
                type="submit" 
                disabled={isProcessing}
                style={{ width: '100%', backgroundColor: '#4f46e5', color: '#ffffff', padding: '16px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
            >
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    )
}