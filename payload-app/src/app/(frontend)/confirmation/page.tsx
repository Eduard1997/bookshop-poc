import Link from "next/link"
import { getOrder, getBookById } from '@/lib/emporix'

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ orderId: string }> }) {
    const { orderId } = await searchParams
    const order = await getOrder(orderId)

    if (!order || order.error) {
        return (
            <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827', padding: '80px 40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Processing Order...</h1>
                <p style={{ margin: '16px 0' }}>Your order ID is: <strong>{orderId}</strong></p>
                <Link href="/books" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }}>← Back to catalog</Link>
            </main>
        )
    }

    const orderItemsWithDetails = await Promise.all(
        (order.entries || []).map(async (entry: any) => {
            const productId = entry.itemYrn.includes(';') ? entry.itemYrn.split(';').pop() : entry.itemYrn;
            const bookDetails = await getBookById(productId);
            return { ...entry, bookDetails };
        })
    );

    const totalPrice = order.calculatedPrice?.finalPrice?.grossValue || 0;

    return (
        <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827', padding: '80px 40px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ margin: '0 0 16px 0', fontSize: '32px', fontWeight: '800', color: '#10b981' }}>Payment Successful!</h1>
                    <p style={{ fontSize: '16px', color: '#6b7280' }}>Your order has been successfully processed.</p>
                    <p style={{ fontSize: '18px', margin: '16px 0' }}>Order ID: <strong style={{color: '#111827'}}>{orderId}</strong></p>
                </div>

                <div style={{ backgroundColor: '#f9fafb', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Order Summary</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                        {orderItemsWithDetails.map((item: any) => (
                            <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                {item.bookDetails?.coverImageUrl ? (
                                    <img src={item.bookDetails.coverImageUrl} alt={item.bookDetails.title} style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
                                ) : (
                                    <div style={{ width: '60px', height: '85px', backgroundColor: '#e5e7eb', borderRadius: '6px' }} />
                                )}
                                
                                <div style={{ flex: '1' }}>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600' }}>{item.bookDetails?.title || 'Unknown Book'}</h3>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Qty: {item.amount || item.orderedAmount || 1}</p>
                                </div>
                                
                                <div style={{ fontWeight: '600', fontSize: '15px' }}>
                                    {item.calculatedUnitPrice?.grossValue || item.price?.effectiveAmount} {order.currency || 'EUR'}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: '700' }}>Total Paid</span>
                        <span style={{ fontSize: '24px', fontWeight: '800', color: '#4f46e5' }}>
                            {totalPrice} {order.currency || 'EUR'}
                        </span>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link href="/books" style={{ display: 'inline-block', color: '#4f46e5', textDecoration: 'none', fontWeight: '600', padding: '12px 24px', border: '2px solid #4f46e5', borderRadius: '8px', transition: 'all 0.2s' }}>
                        ← Return to Storefront
                    </Link>
                </div>
            </div>
        </main>
    )
}