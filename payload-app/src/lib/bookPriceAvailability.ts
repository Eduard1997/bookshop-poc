import { getBookPrices, getBookAvailability, type PriceDetails, type AvailabilityDetails } from './emporix'

export type BookWithPriceAndAvailability<T> = T & {
    price: PriceDetails | null
    availability: AvailabilityDetails | null
}

export async function attachPriceAndAvailability<T extends { id: string }>(
    books: T[]
): Promise<BookWithPriceAndAvailability<T>[]> {
    return Promise.all(
        books.map(async (book) => {
            const [prices, availability] = await Promise.all([
                getBookPrices(book.id).catch(() => []),
                getBookAvailability(book.id).catch(() => null),
            ])
            return {
                ...book,
                price: prices?.[0] ?? null,
                availability,
            }
        })
    )
}