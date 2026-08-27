'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import mockPayment from '@/lib/mockPayment'
import { createOrder } from '@/lib/emporix'

interface PaymentFormProps {
    cartId: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    totalAmount: number // <--- Add this
}

export default function PaymentForm({ cartId, firstName, lastName, email, phone, address, totalAmount }: PaymentFormProps) {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        setErrorMsg("")
        
        const orderPayload = {
            cartId: cartId,
            customer: { firstName, lastName, email, phone },
            addresses: [
                {
                    type: "BILLING",
                    contactName: `${firstName} ${lastName}`,
                    street: address,
                    city: "Unknown", 
                    zipCode: "00000",
                    country: "DE" 
                },
                {
                    type: "SHIPPING",
                    contactName: `${firstName} ${lastName}`,
                    street: address,
                    city: "Unknown",
                    zipCode: "00000",
                    country: "DE"
                }
            ],
            shipping: { 
                shippingMethodId: "standard",
                zoneId: "DE" 
            },
            paymentMethods: [{ 
                provider: "custom", 
                method: "credit_card",
                amount: totalAmount 
            }]
        }

        await mockPayment(cartId)
        const response = await createOrder(orderPayload)

        if (response.error) {
            setErrorMsg("Order failed: Check the terminal for details.")
            setIsProcessing(false)
            return
        }

        router.push(`/confirmation?orderId=${response}`)
    }

    const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', marginBottom: '16px', boxSizing: 'border-box' as const };

    return (
        <form onSubmit={handlePay} style={{ backgroundColor: '#f9fafb', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Payment Details</h2>
            
            {errorMsg && <div style={{ color: 'red', marginBottom: '16px', fontWeight: 'bold' }}>{errorMsg}</div>}
            
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
                {isProcessing ? 'Processing...' : `Pay €${totalAmount}`}
            </button>
        </form>
    )
}