'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import mockPayment from '@/lib/mockPayment'
import { createOrder, updateCartRoot, getBookById } from '@/lib/emporix'

interface PaymentFormProps {
    cart: any
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
}

export default function PaymentForm({ cart, firstName, lastName, email, phone, address }: PaymentFormProps) {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setErrorMsg("")
    
    await mockPayment(cart.id)
    
    const prepResponse = await updateCartRoot(cart.id, {
        contactName: `${firstName} ${lastName}`,
        street: address,
        city: "Stuttgart",
        zipCode: "70173"
    });

    if (prepResponse?.error) {
        setErrorMsg("Failed to prepare cart shipping details.")
        setIsProcessing(false)
        return
    }

    let updatedCart = cart;
    try {
        const cartRes = await fetch('/api/cart');
        if (cartRes.ok) {
            updatedCart = await cartRes.json();
        }
    } catch (err) {
        console.error("Failed to fetch updated cart details:", err);
    }

    const finalAmount = Number(updatedCart?.totalPrice) > 0 ? Number(updatedCart?.totalPrice) : 20.00;

    const entries = await Promise.all((updatedCart?.items || []).map(async (item: any) => {
        const productId = item.itemYrn.includes(';') ? item.itemYrn.split(';').pop() : item.itemYrn;
        const bookDetails = await getBookById(productId);

        return {
        id: productId,
        itemYrn: item.itemYrn,
        amount: item.quantity,
        orderedAmount: item.quantity,
        effectiveQuantity: item.effectiveQuantity || item.quantity,
        product: {
            id: productId,
            sku: bookDetails?.isbn || productId,
            name: bookDetails?.title || productId,
            images: bookDetails?.coverImageUrl ? [{ url: bookDetails.coverImageUrl }] : []
        },
        ...(bookDetails?.mixinSchemaId && bookDetails?.mixinSchemaUrl ? {
            metadata: { mixins: { [bookDetails.mixinSchemaId]: bookDetails.mixinSchemaUrl } },
            mixins: { [bookDetails.mixinSchemaId]: bookDetails.rawMixin || {} }
        } : {}),
        measurementUnit: item.measurementUnit || {
            value: 1,
            unit: "H87"
        },
        calculatedUnitPrice: item.calculatedUnitPrice || {
            netValue: item.price.effectiveAmount,
            grossValue: item.price.effectiveAmount,
            taxValue: 0,
            taxCode: "STANDARD",
            taxRate: 19.0
        },
        calculatedPrice: item.calculatedPrice || {
            price: {
                netValue: item.price.effectiveAmount * item.quantity,
                grossValue: item.price.effectiveAmount * item.quantity,
                taxValue: 0,
                taxCode: "STANDARD",
                taxRate: 19.0
            },
            finalPrice: {
                netValue: item.price.effectiveAmount * item.quantity,
                grossValue: item.price.effectiveAmount * item.quantity,
                taxValue: 0
            }
        }
    }}));

    const orderPayload = {
        currency: updatedCart?.currency || "EUR",
        entries: entries,
        discounts: [],
        customer: {
            id: updatedCart?.sessionId || "guest-001",
            name: `${firstName} ${lastName}`,
            firstName: firstName,
            lastName: lastName,
            email: email
        },
        siteCode: "bookshop-site",
        countryCode: "DE",
        billingAddress: {
            contactName: `${firstName} ${lastName}`,
            street: address,
            streetNumber: "1",
            zipCode: "70173",
            city: "Stuttgart",
            country: "DE"
        },
        shippingAddress: {
            contactName: `${firstName} ${lastName}`,
            street: address,
            streetNumber: "1",
            zipCode: "70173",
            city: "Stuttgart",
            country: "DE"
        },
        payments: [
            {
                status: "PENDING",
                method: "invoice",
                paidAmount: 0,
                currency: updatedCart?.currency || "EUR"
            }
        ],
        calculatedPrice: updatedCart?.calculatedPrice || {
            price: {
                netValue: finalAmount,
                grossValue: finalAmount,
                taxValue: 0
            },
            finalPrice: {
                netValue: finalAmount,
                grossValue: finalAmount,
                taxValue: 0
            }
        },
        channel: {}
    }

    const response = await createOrder(orderPayload)

    if (response.error) {
        setErrorMsg("Order failed: Check the terminal for details.")
        setIsProcessing(false)
        return
    }

        try {
            await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}) 
            })
        } catch (e) {
            console.error("Failed to clear cart:", e)
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
                {isProcessing ? 'Processing...' : `Pay €${cart?.totalPrice || 0}`}
            </button>
        </form>
    )
}