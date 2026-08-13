import { getBookById, getBookPrices } from '../../../../lib/emporix'

export default async function BookPreviewCardPage({ params, }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const book = await getBookById(id)

    if (!book) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444', fontWeight: 'bold', fontFamily: 'system-ui, sans-serif' }}>
                <p>Book not found.</p>
            </div>
        )
    }

    const prices = await getBookPrices(id)

    return (
        <div style={{ maxWidth: '650px', margin: '40px auto', padding: '30px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', fontFamily: 'system-ui, sans-serif' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>{book.title}</h1>
            <p style={{ fontSize: '16px', color: '#4b5563', fontWeight: '500', marginBottom: '14px' }}>{book.subtitle}</p>
            {
                book.authors && book.authors.length > 0 && (
                    <p style={{ fontSize: '14px', color: '#4f46e5', fontWeight: '600', marginBottom: '16px' }}>By: {book.authors.map(a => a.name).join(', ')}</p>)}

            {book.coverImageUrl && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <img
                        style={{ maxHeight: '300px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                        src={book.coverImageUrl}
                        alt={book.title} />
                </div>
            )}
            <p style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace', marginBottom: '20px' }}>ISBN: {book.isbn}</p>

            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Prices:</h3>
                {prices && prices.length > 0 ? (
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#374151', margin: 0 }}>
                        {prices.map((p, index) => (<li key={index} style={{ marginBottom: '4px' }}>{p.country || 'Standard'}: <span style={{ fontWeight: '600', color: '#070808' }}>{p.amount} {p.currency}</span></li>))}
                    </ul>
                ) : (<p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic', margin: 0 }}>Price unavailable</p>)}
            </div>

            {book.description && (
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Description:</h3>
                    <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>{book.description}</p>
                </div>
            )}

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', color: '#4b5563' }}>
                <p style={{ fontWeight: 'bold', color: '#374151', marginBottom: '10px' }}>More details:</p>
                <p style={{ marginBottom: '6px' }}><span style={{ fontWeight: '500', color: '#4b5563' }}>Publication Date:</span> {book.publicationDate}</p>
                <p style={{ marginBottom: '6px' }}><span style={{ fontWeight: '500', color: '#4b5563' }}>Format:</span> {book.productForm}</p>
                <p style={{ marginBottom: '6px' }}><span style={{ fontWeight: '500', color: '#4b5563' }}>Page Count:</span> {book.pageCount}</p>
                <p style={{ marginBottom: '6px' }}><span style={{ fontWeight: '500', color: '#4b5563' }}>Language:</span> {book.language}</p>
                <p style={{ margin: 0 }}><span style={{ fontWeight: '500', color: '#4b5563' }}>Category:</span> <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', border: '1px solid #c7d2fe', display: 'inline-block', marginLeft: '6px' }}>{book.category}</span></p>
            </div>
        </div>
    )
}