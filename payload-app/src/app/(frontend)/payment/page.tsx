import { getCart } from '@/lib/emporix'
import PaymentForm from '../PaymentForm'

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ cartId: string }> }) {
    const { cartId } = await searchParams
    const cart = await getCart(cartId)

    return (
        <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827', padding: '80px 40px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ margin: '0 0 32px 0', fontSize: '32px', fontWeight: '800', textAlign: 'center' }}>Complete Your Order</h1>
                
                <PaymentForm cartId={cartId} />
                
                <div style={{ marginTop: '32px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                    <p>Total to charge: <strong style={{color: '#111827'}}>{cart?.totalPrice} {cart?.currency}</strong></p>
                </div>
            </div>
        </main>
    )
}