import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Metadata } from 'next'
import { getAllProductsFromCatalogViaCategories } from '@/lib/emporix'
import { attachPriceAndAvailability } from '@/lib/bookPriceAvailability'
import { BookCard } from '../../BookCard'

export const dynamic = 'force-dynamic'
const CATALOG_ID = '6a75cbedd753775031ef0588'

export const metadata: Metadata = {
    title: 'Staff Picks',
    description: 'Check out what our team is reading right now.',
}

export default async function StaffPicksPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const staffPicksData = await payload.find({
        collection: 'book-overlays',
        where: { staffPick: { equals: true } },
        limit: 100, 
    })

    const allProducts = await getAllProductsFromCatalogViaCategories(CATALOG_ID)
    
    const resolvedBooks = staffPicksData.docs.map((overlay) => {
        const isbnToFetch = String(overlay.isbn)
        const foundBook = allProducts.find(book => String(book.isbn) === isbnToFetch)
        if (foundBook) return foundBook
        
        const fallbackBook = allProducts.find(book => String(book.id) === isbnToFetch)
        return fallbackBook || null
    }).filter(Boolean)

    const enrichedBooks = await attachPriceAndAvailability(resolvedBooks as any[])

    return (
        <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827', paddingBottom: '60px' }}>
            <div style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '40px 40px', marginBottom: '40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 6px 0', letterSpacing: '0.05em' }}>
                        Staff Picks
                    </h1>
                    <p style={{ margin: 0, color: '#e0e7ff', fontSize: '15px' }}>
                        Check out what our team is reading right now.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    {enrichedBooks.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#374151' }}>No Staff Picks Yet</h3>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Check back soon to see what our team is reading.</p>
                        </div>
                    ) : (
                        enrichedBooks.map((book: any, idx: number) => (
                            <BookCard key={book.id || idx} book={book} />
                        ))
                    )}
                </div>
            </div>
        </main>
    )
}