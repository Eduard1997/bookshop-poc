import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getAllProductsFromCatalogViaCategories } from '@/lib/emporix'

export const dynamic = 'force-dynamic'

export default async function DiscoverPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    
    const CATALOG_ID = '6a75cbedd753775031ef0588'
    const allProducts = await getAllProductsFromCatalogViaCategories(CATALOG_ID)
    
    const listsData = await payload.find({
        collection: 'curated-lists',
        depth: 2
    })

    const shelves = listsData.docs.map((list) => {
        const listBooks = (list.books || []).map((item) => {
            const overlay = item.bookOverlay
            let isbnToFetch = ''

            if (overlay) {
                if (typeof overlay === 'object' && 'isbn' in overlay && overlay.isbn) {
                    isbnToFetch = String(overlay.isbn)
                } else if (typeof overlay === 'string' || typeof overlay === 'number') {
                    isbnToFetch = String(overlay)
                }
            }

            if (isbnToFetch) {
                const foundBook = allProducts.find(book => String(book.isbn) === isbnToFetch)
                if (foundBook) {
                    return foundBook
                }
                
                const fallbackBook = allProducts.find(book => String(book.id) === isbnToFetch)
                return fallbackBook || null
            }
            return null
        })
        
        return {
            ...list,
            fetchedBooks: listBooks.filter(Boolean)
        }
    })

    return (
        <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827', paddingBottom: '60px' }}>
            
            <div style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '40px 40px', marginBottom: '40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 6px 0', letterSpacing: '0.05em' }}>
                            Discover
                        </h1>
                        <p style={{ margin: 0, color: '#e0e7ff', fontSize: '15px' }}>
                            Explore our curated lists and staff favorites
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
                {shelves.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>No curated lists found.</p>
                ) : (
                    shelves.map((shelf) => (
                        <div key={shelf.id} style={{ marginBottom: '60px' }}>
                            <div style={{ marginBottom: '24px', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0', color: '#111827' }}>
                                    {shelf.title}
                                </h2>
                                {shelf.description && (
                                    <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>
                                        {shelf.description}
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                                {shelf.fetchedBooks.length === 0 ? (
                                    <p style={{ color: '#9ca3af', fontSize: '14px', fontStyle: 'italic' }}>No books available in this list.</p>
                                ) : (
                                    shelf.fetchedBooks.map((book: any, index: number) => {
                                        const authorNames = book?.authors?.map((a: any) => a.name).filter(Boolean).join(', ') || 'Unknown Author'
                                        const categoryName = book?.category || 'Uncategorized'
                                        const bookId = book?.id || index

                                        return (
                                            <Link
                                                key={bookId}
                                                href={`/books/${book?.id}`}
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e7eb',
                                                    padding: '12px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                                                }}
                                            >
                                                {book?.coverImageUrl ? (
                                                    <img
                                                        src={book.coverImageUrl}
                                                        alt={book?.title || 'Book cover'}
                                                        style={{
                                                            width: '100%',
                                                            height: '260px',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px',
                                                            marginBottom: '12px',
                                                            backgroundColor: '#f3f4f6'
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: '100%',
                                                        height: '260px',
                                                        backgroundColor: '#f3f4f6',
                                                        borderRadius: '6px',
                                                        marginBottom: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#9ca3af',
                                                        fontSize: '13px'
                                                    }}>No image available</div>
                                                )}

                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    color: '#4f46e5',
                                                    marginBottom: '4px'
                                                }}>{categoryName}</span>

                                                <h3 style={{
                                                    fontSize: '15px',
                                                    fontWeight: '600',
                                                    color: '#111827',
                                                    marginBottom: '6px',
                                                    lineHeight: '1.3'
                                                }}>{book?.title || 'Untitled Book'}</h3>

                                                <p style={{
                                                    fontSize: '13px',
                                                    color: '#16a34a',
                                                    marginTop: 'auto',
                                                    marginBottom: '0',
                                                    fontWeight: '500'
                                                }}>{authorNames}</p>
                                            </Link>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}