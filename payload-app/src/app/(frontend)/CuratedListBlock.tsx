import React from 'react'
import { BookCard } from './BookCard'

export const CuratedListBlock = ({ list, books }: { list: any, books: any[] }) => {
    return (
        <div style={{ marginBottom: '60px' }}>
            {list.showTitle && (
                <div style={{ marginBottom: '24px', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0', color: '#111827' }}>
                        {list.title}
                    </h2>
                    {list.description && (
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>
                            {list.description}
                        </p>
                    )}
                </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '24px',
                    maxWidth: '100%',
                    paddingBottom: '24px',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                }}>
                    {books.length === 0 ? (
                        <p style={{ color: '#9ca3af', fontSize: '14px', fontStyle: 'italic', margin: '0 auto' }}>
                            No books available.
                        </p>
                    ) : (
                        books.map((book: any, idx: number) => (
                            <div key={book.id || idx} style={{ flex: '0 0 auto', width: '220px', scrollSnapAlign: 'start' }}>
                                <BookCard book={book} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}