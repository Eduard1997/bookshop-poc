import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getBookByISBN } from '@/lib/emporix'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export default async function EditorialPage({ params, }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const payload = await getPayload({ config })
    const pageRes = await payload.find({
        collection: 'landing-pages',
        where: { slug: { equals: slug, }, },
        limit: 1,
        overrideAccess: true,
        draft: true,
    })
    const pageContent = pageRes.docs[0]

    if (!pageContent) { notFound() }

    const booksWithEmporixData = await Promise.all(
        (pageContent.books || []).map(async (item: any) => {
            const emporixBook = await getBookByISBN(item.isbn)
            return {
                ...item,
                emporixData: emporixBook,
            }
        })
    )
    return (
        <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '50px 40px', marginBottom: '40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 10px 0' }}>
                            {pageContent.title}
                        </h1>
                        {pageContent.subtitle && (
                            <p style={{ margin: 0, color: '#e0e7ff', fontSize: '16px' }}>
                                {pageContent.subtitle}
                            </p>
                        )}
                    </div>

                    <Link
                        href="/books"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.18)',
                            color: '#ffffff',
                            padding: '10px 18px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(4px)'
                        }}
                    > ← Back to Categories
                    </Link>
                </div>
            </div>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 60px 40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                    {booksWithEmporixData.map((item: any, index: number) => {
                        const book = item.emporixData
                        return (
                            <div
                                key={index}
                                style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                {book?.coverImageUrl ? (
                                    <img
                                        src={book.coverImageUrl}
                                        alt={book?.title || 'Book cover'}
                                        style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px', backgroundColor: '#f3f4f6' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '280px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '14px' }}>
                                        No Cover Available
                                    </div>
                                )}
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>
                                    {book?.title || `Book (ISBN: ${item.isbn})`}
                                </h3>
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 14px 0' }}>
                                    ISBN: <strong>{item.isbn}</strong>
                                </p>
                                {item.editorialReview && (
                                    <div style={{ backgroundColor: '#f9fafb', borderLeft: '4px solid #4f46e5', padding: '12px', borderRadius: '4px', marginBottom: '16px', marginTop: 'auto' }}>
                                        <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#374151' }}>
                                            "{item.editorialReview}"
                                        </p>
                                    </div>
                                )}
                                {book?.id && (
                                    <Link
                                        href={`/books/${book.id}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: '#4f46e5',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    > View details in store →
                                    </Link>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}