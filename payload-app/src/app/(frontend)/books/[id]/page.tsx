import { getBookById, getBookPrices, getBookAvailability } from '../../../../lib/emporix'

/**
 * Test page: /books/<emporix-product-id>
 *
 * Three separate fetches, kept visibly separate — this mirrors how the
 * data actually lives in Emporix: product+mixin, price, and availability
 * are three different services, not one combined object. The importer
 * writes to all three separately (see api.py: POST_product, POST_price,
 * POST_availability) — the storefront reads them the same way.
 */

export default async function BookTestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const book = await getBookById(id)

  if (!book) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Not found</h1>
        <p>No product with id &quot;{id}&quot; in Emporix.</p>
      </div>
    )
  }

  // Fetched in parallel — independent calls, no reason to wait on each other.
  const [prices, availability] = await Promise.all([
    getBookPrices(id),
    getBookAvailability(id),
  ])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 600 }}>
      {book.coverImageUrl && (
        <img
          src={book.coverImageUrl}
          alt={book.title}
          style={{ maxWidth: 150, marginBottom: '1rem' }}
        />
      )}

      <h1 style={{ marginBottom: 0 }}>{book.title}</h1>
      {book.subtitle && <p style={{ color: '#888', marginTop: 4 }}>{book.subtitle}</p>}

      <p style={{ color: '#fff' }}>ISBN: {book.isbn}</p>

      {book.authors.length > 0 && (
        <p>
          {book.authors
            .map((a) => `${a.name}${a.role !== 'author' ? ` (${a.role})` : ''}`)
            .join(', ')}
        </p>
      )}

      <ul style={{ color: '#fff', fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
        {book.publisher && <li>Publisher: {book.publisher}</li>}
        {book.publicationDate && <li>Published: {book.publicationDate}</li>}
        {book.language && <li>Language: {book.language}</li>}
        {book.pageCount && <li>Pages: {book.pageCount}</li>}
        {book.productForm && <li>Format: {book.productForm}</li>}
        {book.category && <li>Category: {book.category}</li>}
      </ul>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#fafafa', borderRadius: 8, color: '#000' }}>
        {prices.length > 0 ? (
          prices.map((p, i) => (
            <p key={i} style={{ margin: 0, fontWeight: 600 }}>
              {p.amount.toFixed(2)} {p.currency}
            </p>
          ))
        ) : (
          <p style={{ margin: 0, color: '#999' }}>No price found</p>
        )}

        {availability ? (
          <p style={{ margin: '4px 0 0', color: availability.available ? 'green' : 'crimson' }}>
            {availability.available
              ? `In stock (${availability.stockLevel})`
              : 'Out of stock'}
          </p>
        ) : (
          <p style={{ margin: '4px 0 0', color: '#999' }}>No availability data</p>
        )}
      </div>

      {book.description && (
        <div style={{ marginTop: '1rem' }} dangerouslySetInnerHTML={{ __html: book.description }} />
      )}
    </div>
  )
}
