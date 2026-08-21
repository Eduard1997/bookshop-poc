# Cart and Checkout Architecture Contract

## 1. The Session Cookie
* Name: bookshop_cart_id
* Technology: Next.js Route Handler (/api/cart/route.ts)
* Purpose: To permanently store the Emporix Cart ID, tying the browser to the backend cart.
* Lifespan: 7-day expiry.
* Initialization: A new cart is strictly created automatically upon the first item being added

## 2. The Central Rule
* Rule: The displayed cart total and line-item prices MUST always come from the Emporix API.
* Restriction: The storefront will never calculate prices, sub-totals, or taxes locally.

## 3. The Cart Object Shape
```typescript
type Cart = {
    id: string
    yrn: string
    currency: string
    sessionId: string
    items: {
        id: string
        itemYrn: string
        quantity: number
        effectiveQuantity: number
        price: {
            priceId: string
            originalAmount: number
            effectiveAmount: number
            currency: string
        }
    }[]
}