import { NextResponse } from 'next/server';
import { getActiveCartIdForCustomer } from '@/lib/emporix'; 
import { mergeCarts, updateCart } from '@/lib/emporix';

export async function POST(request: Request) {
    try {
        const { guestCartId, customerId } = await request.json();
        
        if (!guestCartId || !customerId) {
            return NextResponse.json({ error: "Missing required IDs" }, { status: 400 });
        }
        const existingUserCartId = await getActiveCartIdForCustomer(customerId);

        if (existingUserCartId) {
            await mergeCarts(existingUserCartId, guestCartId);
        } else {
            
            await updateCart(guestCartId, { 
                customerId: String(customerId),
            });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Cart sync error:", error);
        return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
    }
}