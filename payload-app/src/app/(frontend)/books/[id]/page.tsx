import { getBookById, getBookPrices, getBookAvailability } from '../../../../lib/emporix'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function BookPreviewCardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    
    const book = await getBookById(id)
    const prices = await getBookPrices(id)
    const availability = await getBookAvailability(id) 

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    if (!book) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'sans-serif' }}>
                <h2>Book not found.</h2>
            </div>
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

    let finalImageUrl = book.coverImageUrl;

    const altCover = bookOverlay?.alternativeCoverImage;

    if (altCover && typeof altCover === 'object' && typeof altCover.url === 'string') {
        finalImageUrl = altCover.url;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: hasLeftColumn ? 'flex-start' : 'center' }}>
                
                {hasLeftColumn && (
                    <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                        {finalImageUrl && (
                            <img
                                src={finalImageUrl}
                                alt={book.title}
                                style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                            />
                        )}
                        
                        {bookOverlay?.staffPick && (
                            <div style={{ background: '#ffd700', color: '#000', padding: '0.75rem', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }}>
                                ⭐ Staff Pick
                            </div>
                        )}
                    </div>
                )}

                <div style={{ flex: hasLeftColumn ? '2' : '1', minWidth: '300px', maxWidth: hasLeftColumn ? 'none' : '700px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div style={{ textAlign: hasLeftColumn ? 'left' : 'center' }}>
                        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', lineHeight: '1.2' }}>{book.title}</h1>
                        {book.subtitle && <h2 style={{ margin: '0 0 1rem 0', opacity: 0.7, fontSize: '1.25rem', fontWeight: 'normal' }}>{book.subtitle}</h2>}
                        
                        {book.authors && book.authors.length > 0 && (
                            <p style={{ fontSize: '1.1rem', margin: 0 }}>
                                By <strong>{book.authors.map(a => a.name).join(', ')}</strong>
                            </p>
                        )}
                    </div>

                    <div style={{ background: 'rgba(128, 128, 128, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.2)', textAlign: 'left' }}>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Price: </span>
                            {prices && prices.length > 0 ? (
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {prices[0].amount} {prices[0].currency}
                                </span>
                            ) : (
                                <span style={{ opacity: 0.7 }}>Unavailable</span>
                            )}
                        </div>

                        <div>
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Status: </span>
                            {availability?.available ? (
                                <span style={{ color: '#4ade80', fontWeight: '600' }}>
                                    ✅ In Stock ({availability.stockLevel} available)
                                </span>
                            ) : (
                                <span style={{ color: '#f87171', fontWeight: '600' }}>
                                    ❌ Out of Stock
                                </span>
                            )}
                        </div>
                    </div>

                    {bookOverlay?.blurb && (
                        <div style={{ borderLeft: '4px solid #ffd700', paddingLeft: '1rem', fontStyle: 'italic', opacity: 0.9, textAlign: 'left' }}>
                            <strong>Staff Note:</strong> "{bookOverlay.blurb}"
                        </div>
                    )}

                    {book.description && (
                        <div style={{ textAlign: 'left' }}>
                            <h3 style={{ borderBottom: '1px solid rgba(128, 128, 128, 0.2)', paddingBottom: '0.5rem' }}>Description</h3>
                            <p style={{ lineHeight: '1.6', opacity: 0.8 }}>{book.description}</p>
                        </div>
                    )}

                    <div style={{ textAlign: 'left' }}>
                        <h3 style={{ borderBottom: '1px solid rgba(128, 128, 128, 0.2)', paddingBottom: '0.5rem' }}>Product Details</h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', opacity: 0.8 }}>
                            <li><strong>ISBN:</strong> {book.isbn}</li>
                            <li><strong>Publication Date:</strong> {book.publicationDate || 'N/A'}</li>
                            <li><strong>Format:</strong> {book.productForm || 'N/A'}</li>
                            <li><strong>Pages:</strong> {book.pageCount || 'N/A'}</li>
                            <li><strong>Language:</strong> {book.language || 'N/A'}</li>
                            <li><strong>Category:</strong> {book.category || 'N/A'}</li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    )
}