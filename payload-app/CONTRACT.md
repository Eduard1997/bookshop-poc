# Cart and Checkout Architecture Contract

## 1. The Session Cookie
* Name: emporix_session_id
* Technology: Next.js native cookies (next/headers)
* Purpose: To store the anonymous customer identifier.
* Lifespan: 7 days.

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