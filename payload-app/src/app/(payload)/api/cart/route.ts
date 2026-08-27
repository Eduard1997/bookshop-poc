import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCart, createCart, addToCart, updateCartItem, removeCartItem, clearCart } from "@/lib/emporix";

export async function GET() {
    const cookieStore = await cookies()
    const bookshop_cart_id = cookieStore.get('bookshop_cart_id')?.value

    if (!bookshop_cart_id) {
        return NextResponse.json({ items: [] }, { status: 200 })
    }

    const cart = await getCart(bookshop_cart_id)

    if (!cart) {
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
    }
    
    return NextResponse.json(cart, { status: 200 })
}

export async function POST(request: Request) {
    const body = await request.json()
    const { itemYrn, priceId, priceAmount, quantity } = body

    const cookieStore = await cookies()
    let bookshop_cart_id = cookieStore.get('bookshop_cart_id')?.value
    
    if (!bookshop_cart_id) {
        const sessionId = crypto.randomUUID()
        const cartId = await createCart(sessionId)

        if (!cartId) {
            return NextResponse.json({ error: "Failed to create cart" }, { status: 500 })
        }

        cookieStore.set('bookshop_cart_id', cartId, { maxAge: 604800 })
        bookshop_cart_id = cartId
    }
    
    const response = await addToCart(bookshop_cart_id, itemYrn, priceId, priceAmount, quantity)

    if (response?.error) {
        return NextResponse.json({ error: response.error }, { status: 400 })
    }

    return NextResponse.json(response, { status: 200 })
}

export async function PUT(request: Request) {
    const body = await request.json()
    const { lineItemId, itemYrn, priceId, priceAmount, quantity } = body

    const cookieStore = await cookies()
    let bookshop_cart_id = cookieStore.get('bookshop_cart_id')?.value

    if (!bookshop_cart_id || !lineItemId) {
        return NextResponse.json({ error: "Failed to update cart" }, { status: 400 })
    }

    const response = await updateCartItem(lineItemId, bookshop_cart_id, itemYrn, priceId, priceAmount, quantity)
    
    if (response?.error) {
        return NextResponse.json({ error: response.error }, { status: 400 })
    }

    return NextResponse.json(response, { status: 200 })
}

export async function DELETE(request: Request) {
    const body = await request.json()
    const { lineItemId } = body

    const cookieStore = await cookies()
    let bookshop_cart_id = cookieStore.get('bookshop_cart_id')?.value

    if (!bookshop_cart_id) {
        return NextResponse.json({ error: "Failed to delete cart" }, { status: 400 })
    }

    if (lineItemId) {
        const response = await removeCartItem(bookshop_cart_id, lineItemId)
        
        if (typeof response === 'object' && response?.error) {
            return NextResponse.json({ error: "Failed to delete item from cart" }, { status: 500 })
        }
    } else {
        const response = await clearCart(bookshop_cart_id)
        
        if (typeof response === 'object' && response?.error) {
            return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
        }
    }

    return NextResponse.json({ success: true }, { status: 200 })
}