import { getBookById, getBookPrices, getBookAvailability } from '../../../../lib/emporix'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import React from 'react'
import PriceSelector from '../../PriceSelector'

export default async function BookPreviewCardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    
    const book = await getBookById(id)
    const prices = await getBookPrices(id)
    const availability = await getBookAvailability(id) 

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    if (!book) {
        return (
            <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#6b7280' }}>Book not found.</h2>
                    <Link href="/books" style={{ display: 'inline-block', marginTop: '16px', color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }}>← Back to catalog</Link>
                </div>
            </main>
        )
    }

    const bookOverlayData = await payload.find({
        collection: 'book-overlays', 
        where: { isbn: { equals: book.isbn } }
    })
    const bookOverlay = bookOverlayData.docs[0]

    let finalImageUrl = book.coverImageUrl;
    const altCover = bookOverlay?.alternativeCoverImage;
    if (altCover && typeof altCover === 'object' && typeof altCover.url === 'string') {
        finalImageUrl = altCover.url;
    }

    const hasLeftColumn = finalImageUrl || bookOverlay?.staffPick;

    return (
        <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827', paddingBottom: '80px' }}>
            
            <div style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '24px 40px', marginBottom: '40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Link href="/books" style={{ color: '#e0e7ff', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', transition: 'color 0.2s' }}>
                        ← Back to Books
                    </Link>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: hasLeftColumn ? 'flex-start' : 'center' }}>
                    
                    {hasLeftColumn && (
                        <div style={{ flex: '1', minWidth: '300px', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {finalImageUrl ? (
                                <img
                                    src={finalImageUrl}
                                    alt={book.title}
                                    style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', backgroundColor: '#f3f4f6' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '500px', backgroundColor: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '15px' }}>
                                    No image available
                                </div>
                            )}
                            
                            {bookOverlay?.staffPick && (
                                <div style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: '700', fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', border: '1px solid #fde68a' }}>
                                    ⭐ Staff Pick
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ flex: hasLeftColumn ? '2' : '1', minWidth: '300px', maxWidth: hasLeftColumn ? 'none' : '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        <div style={{ textAlign: hasLeftColumn ? 'left' : 'center' }}>
                            {book.category && (
                                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#4f46e5', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                                    {book.category}
                                </span>
                            )}
                            <h1 style={{ margin: '0 0 8px 0', fontSize: '36px', fontWeight: '800', lineHeight: '1.2', color: '#111827' }}>{book.title}</h1>
                            {book.subtitle && <h2 style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '20px', fontWeight: '500', lineHeight: '1.4' }}>{book.subtitle}</h2>}
                            
                            {book.authors && book.authors.length > 0 && (
                                <p style={{ fontSize: '16px', margin: 0, color: '#374151' }}>
                                    By <span style={{ color: '#16a34a', fontWeight: '600' }}>{book.authors.map(a => a.name).join(', ')}</span>
                                </p>
                            )}
                        </div>

                        <PriceSelector prices={prices} availability={availability} />

                        {bookOverlay?.blurb && (
                            <div style={{ backgroundColor: '#f9fafb', borderLeft: '4px solid #4f46e5', padding: '16px 20px', borderRadius: '0 8px 8px 0' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#4f46e5', letterSpacing: '0.05em', marginBottom: '4px' }}>Staff Note</div>
                                <p style={{ margin: 0, fontStyle: 'italic', color: '#374151', fontSize: '15px', lineHeight: '1.6' }}>"{bookOverlay.blurb}"</p>
                            </div>
                        )}

                        {book.description && (
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px', margin: '0 0 16px 0' }}>Description</h3>
                                <p style={{ lineHeight: '1.7', color: '#4b5563', fontSize: '15px', margin: 0 }}>{book.description}</p>
                            </div>
                        )}

                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px', margin: '0 0 16px 0' }}>Product Details</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                <li style={{ fontSize: '14px', color: '#4b5563' }}><strong style={{ color: '#111827', fontWeight: '600' }}>ISBN:</strong> {book.isbn}</li>
                                <li style={{ fontSize: '14px', color: '#4b5563' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Published:</strong> {book.publicationDate || 'N/A'}</li>
                                <li style={{ fontSize: '14px', color: '#4b5563' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Format:</strong> {book.productForm || 'N/A'}</li>
                                <li style={{ fontSize: '14px', color: '#4b5563' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Pages:</strong> {book.pageCount || 'N/A'}</li>
                                <li style={{ fontSize: '14px', color: '#4b5563' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Language:</strong> {book.language || 'N/A'}</li>
                                <li style={{ fontSize: '14px', color: '#4b5563' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Publisher:</strong> {book.publisher || 'N/A'}</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}