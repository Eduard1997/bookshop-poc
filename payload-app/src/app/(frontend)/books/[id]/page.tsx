import { getBookById, getBookPrices } from '../../../../lib/emporix'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function BookPreviewCardPage({ params, }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const book = await getBookById(id)
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    
    

    if (!book) {
        return (<div><p>Book not found.</p></div>)
    }

    const bookOverlayData = await payload.find({collection: 'book-overlays', where: { isbn: { equals: book.isbn } }})
    const bookOverlay = bookOverlayData.docs[0]

    const prices = await getBookPrices(id)

    let finalImageUrl = book.coverImageUrl;

    const altCover = bookOverlay?.alternativeCoverImage;

    if (altCover && typeof altCover === 'object' && typeof altCover.url === 'string') {
        finalImageUrl = altCover.url;
    }

    return (
        <div>
            <h1>{book.title}</h1>
            <p>Subtitle: {book.subtitle}</p>
            {
                book.authors && book.authors.length > 0 && (
                    <p>By: {book.authors.map(a => a.name).join(', ')}</p>)}
            <div>
            {bookOverlay?.staffPick &&  <p>This book is a staff pick</p>}

            {bookOverlay?.blurb && (
                <div>
                    <h3>Staff note:</h3>
                    <p>{bookOverlay.blurb}</p>
                </div>
            )}
            </div>

            {finalImageUrl && (
                <div>
                    <img
                        src={finalImageUrl}
                        alt={book.title} 
                    />
                </div>
            )}
            <p>ISBN: {book.isbn}</p>

            <div>
                <h3>Prices:</h3>
                {prices && prices.length > 0 ? (
                    <ul>
                        {prices.map((p, index) => (<li key={index}>{p.country || 'Standard'}: {p.amount} {p.currency}</li>))}
                    </ul>
                ) : (<p>Price unavailable</p>)}
            </div>

            {book.description && (
                <div>
                    <h3>Description:</h3>
                    <p>{book.description}</p>
                </div>
            )}

            <p>More details:</p>
            <p>Publication Date: {book.publicationDate}</p>
            <p>Format: {book.productForm}</p>
            <p>Page Count: {book.pageCount}</p>
            <p>Language: {book.language}</p>
            <p>Category: {book.category}</p>
        </div>
    )
}