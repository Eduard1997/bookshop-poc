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
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '20px'
            }}>
                {books.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontSize: '14px', fontStyle: 'italic' }}>
                        No books available.
                    </p>
                ) : (
                    books.map((book: any, idx: number) => (
                        <BookCard key={book.id || idx} book={book} />
                    ))
                )}
            </div>
        </div>
    )
}