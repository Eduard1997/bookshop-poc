import { cookies } from 'next/headers'
import { getCart, getBookById } from '@/lib/emporix'
import CartClient from './CartClient'
import Link from 'next/link'
import EmptyCart from './EmptyCart'

export default async function CartPage() {
    const cookieStore = await cookies()
    const cartId = cookieStore.get('bookshop_cart_id')?.value

    if (!cartId) return <EmptyCart />

    const cart = await getCart(cartId)
    if (!cart || !cart.items || cart.items.length === 0) return <EmptyCart />

    const cartItemsWithDetails = await Promise.all(
        cart.items.map(async (item: any) => {
            const productId = item.itemYrn?.includes(';') ? item.itemYrn.split(';').pop() : item.itemYrn
            const bookDetails = await getBookById(productId)
            return { ...item, bookDetails }
        })
    )

    const emporixTotal = (cart as any).totalPrice?.amount ?? 0
    const currency = cart.currency || 'EUR'

    return <CartClient initialItems={cartItemsWithDetails} cartTotal={emporixTotal} currency={currency} />
}