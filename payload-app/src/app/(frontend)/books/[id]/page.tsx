import { getPayload } from 'payload'
import config from '@payload-config'
import { getBookById, getBookPrices, getBookAvailability } from '../../../../lib/emporix'

/**
 * Test page: /books/<emporix-product-id>
 *
 * Two DIFFERENT kinds of data access, on purpose, side by side:
 *
 *  1. Emporix — HTTP fetch, crosses the network, needs a Bearer token.
 *     (title, authors, price, availability — commerce data)
 *
 *  2. Payload — Local API, in-process, no network hop, fully typed.
 *     (staff pick, editor's blurb — editorial overlay, keyed by ISBN)
 *
 * If you ever find yourself writing fetch('/api/...') to reach Payload
 * from a page inside this same app, stop — that's what Local API replaces.
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

  // Emporix: two more HTTP calls, independent of each other.
  const [prices, availability] = await Promise.all([
    getBookPrices(id),
    getBookAvailability(id),
  ])

  // Payload: Local API, no HTTP, same process. Looked up by ISBN, not by
  // the Emporix product id — the two systems don't share identifiers,
  // ISBN is the only thing that connects them.
  const payload = await getPayload({ config })
  const overlayResult = await payload.find({
    collection: 'book-overlays',
    where: { isbn: { equals: book.isbn } },
    limit: 1,
  })
  const overlay = overlayResult.docs[0] ?? null
  const coverUrl =
        (overlay?.alternativeCover && typeof overlay.alternativeCover === 'object'
            ? overlay.alternativeCover.url
            : null) ?? book.coverImageUrl

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 600 }}>
      {overlay?.staffPick && (
        <div
          style={{
            display: 'inline-block',
            background: '#fef3c7',
            color: '#92400e',
            padding: '2px 10px',
            borderRadius: 999,
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          ★ Staff pick
        </div>
      )}

        {coverUrl && (
            <img
                src={coverUrl}
                alt={book.title}
                style={{ maxWidth: 150, marginBottom: '1rem', display: 'block' }}
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

      <ul style={{ fontSize: '0.9rem', paddingLeft: '1.2rem', color: '#fff' }}>
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
            {availability.available ? `In stock (${availability.stockLevel})` : 'Out of stock'}
          </p>
        ) : (
          <p style={{ margin: '4px 0 0', color: '#999' }}>No availability data</p>
        )}
      </div>

      {book.description && (
        <div style={{ marginTop: '1rem' }} dangerouslySetInnerHTML={{ __html: book.description }} />
      )}

      {overlay?.blurb && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderLeft: '3px solid #92400e',
            background: '#fffbeb',
            fontStyle: 'italic',
            color: '#000'
          }}
        >
          {overlay.blurb}
        </div>
      )}

      {!overlay && (
        <p style={{ marginTop: '1.5rem', color: '#999', fontSize: '0.85rem' }}>
          No Payload editorial overlay for this ISBN yet — the page still works
          without one. Add one in /admin under &quot;Book Overlays&quot; to see it appear here.
        </p>
      )}
    </div>
  )
}
