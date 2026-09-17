import React from 'react'
import Link from 'next/link'

export const BookCard = ({ book, isDetailed = false }: { book: any, isDetailed?: boolean }) => {
    const authorNames = book?.authors?.map((a: any) => a.name).filter(Boolean).join(', ') || 'Unknown Author'
    const categoryName = book?.category || 'Uncategorized'
    const bookId = book?.id
    const bookISBN = book?.isbn

    return (
        <Link
            href={`/books/${bookId}`}
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
                        height: isDetailed ? '320px' : '260px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        marginBottom: '12px',
                        backgroundColor: '#f3f4f6'
                    }}
                />
            ) : (
                <div style={{
                    width: '100%',
                    height: isDetailed ? '320px' : '260px',
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

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '8px'
            }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
                    {book?.price ? `${book.price.amount} ${book.price.currency}` : 'Price unavailable'}
                </span>

                {book?.availability?.available ? (
                    <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#16a34a', borderRadius: '50%' }} />
                        In Stock
                    </span>
                ) : (
                    <span style={{ color: '#dc2626', fontWeight: '700', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#dc2626', borderRadius: '50%' }} />
                        Out of Stock
                    </span>
                )}
            </div>

            {isDetailed && (
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', lineHeight: '1.4' }}>ISBN: {bookISBN}</p>
            )}
        </Link>
    )
}