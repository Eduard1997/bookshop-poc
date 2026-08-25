import { cookies } from 'next/headers'
import { getCart, getBookById } from '@/lib/emporix'
import Link from 'next/link'

export default async function CheckoutPage() {
    const cookieStore = await cookies()
    const cartId = cookieStore.get('bookshop_cart_id')?.value

    if (!cartId) {
        return (
            <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#6b7280' }}>Your cart is empty.</h2>
                    <Link href="/books" style={{ display: 'inline-block', marginTop: '16px', color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }}>← Back to catalog</Link>
                </div>
            </main>
        )
    }

    const cart = await getCart(cartId)

    if (!cart) {
        return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>Error fetching cart data.</div>
    }

    const cartItemsWithDetails = await Promise.all(
        cart.items?.map(async (item: any) => {
            const productId = item.itemYrn.includes(';') ? item.itemYrn.split(';').pop() : item.itemYrn;
            const bookDetails = await getBookById(productId);
            return { ...item, bookDetails };
        }) || []
    );

    const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', marginBottom: '16px', boxSizing: 'border-box' as const };

    return (
        <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827', paddingBottom: '80px' }}>
            
            <div style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '24px 40px', marginBottom: '40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Link href="/cart" style={{ color: '#e0e7ff', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'inline-flex', alignItems: 'center' }}>
                        ← Back to Cart
                    </Link>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
                <h1 style={{ margin: '0 0 32px 0', fontSize: '32px', fontWeight: '800' }}>Secure Checkout</h1>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'flex-start' }}>
                    
                    <div style={{ flex: '1.5', minWidth: '300px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>Customer Details</h2>
                        
                        <form action="/payment" style={{ display: 'flex', flexDirection: 'column' }}>
                            <input type="hidden" name="cartId" value={cartId} />
                            
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <input type="text" name="FirstName" placeholder="First Name" required style={inputStyle} />
                                <input type="text" name="LastName" placeholder="Last Name" required style={inputStyle} />
                            </div>
                            
                            <input type="email" name="Email" placeholder="Email Address" required style={inputStyle} />
                            <input type="tel" name="Phone" placeholder="Phone Number" required style={inputStyle} />
                            <input type="text" name="Address" placeholder="Full Shipping Address" required style={inputStyle} />
                            
                            <button type="submit" style={{ marginTop: '16px', backgroundColor: '#4f46e5', color: '#ffffff', padding: '16px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                                Proceed to Payment
                            </button>
                        </form>
                    </div>

                    <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#f9fafb', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Order Summary</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                            {cartItemsWithDetails.map((item: any) => (
                                <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    
                                    {item.bookDetails?.coverImageUrl ? (
                                        <img src={item.bookDetails.coverImageUrl} alt={item.bookDetails.title} style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
                                    ) : (
                                        <div style={{ width: '60px', height: '85px', backgroundColor: '#e5e7eb', borderRadius: '6px' }} />
                                    )}
                                    
                                    <div style={{ flex: '1' }}>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600' }}>{item.bookDetails?.title || 'Unknown Book'}</h3>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Qty: {item.quantity}</p>
                                    </div>
                                    
                                    <div style={{ fontWeight: '600', fontSize: '15px' }}>
                                        {item.price?.effectiveAmount} {item.price?.currency}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '18px', fontWeight: '700' }}>Total</span>
                            <span style={{ fontSize: '24px', fontWeight: '800', color: '#4f46e5' }}>
                                {cart.totalPrice} {cart.currency}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}