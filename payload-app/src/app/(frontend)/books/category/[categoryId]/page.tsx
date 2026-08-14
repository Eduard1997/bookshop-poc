import React from 'react'
import Link from 'next/link'
import { getCategoriesWithNamesForCatalog, getProductsByCategory } from '../../../../../lib/emporix'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params, }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await params
    const CATALOG_ID = '6a75cbedd753775031ef0588'

    const categories = await getCategoriesWithNamesForCatalog(CATALOG_ID)
    const currentCat: any = categories.find((c: any) => c.id === categoryId)
    const categoryName = currentCat?.localizedName?.en || Object.values(currentCat?.localizedName || {})[0] || 'Category'

    const products = await getProductsByCategory(categoryId)

    return (
        <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

            <div style={{
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                padding: '40px 40px',
                marginBottom: '40px'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            margin: '0 0 6px 0',
                            letterSpacing: '0.05em'
                        }}>{categoryName}</h1>
                        <p style={{ margin: 0, color: '#e0e7ff', fontSize: '15px' }}>Explore books in this category</p>
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
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.15s ease'
                        }}>← Back to Categories</Link>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 60px 40px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '25px'
                }}>
                    {products.length === 0 ? (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#6b7280', fontSize: '16px' }}>No books found in this category.</p>
                    ) : (
                        products.map((book: any, index: number) => {
                            const authorNames = book?.authors?.map((a: any) => a.name).filter(Boolean).join(', ') || 'Unknown Author'
                            const bookId = book?.id || index

                            return (
                                <Link
                                    key={bookId}
                                    href={`/books/${book?.id}`}
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '12px',
                                        border: '1px solid #e5e7eb',
                                        padding: '16px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
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
                                                height: '280px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                marginBottom: '15px',
                                                backgroundColor: '#f3f4f6'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '280px',
                                            backgroundColor: '#f3f4f6',
                                            borderRadius: '8px',
                                            marginBottom: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#9ca3af',
                                            fontSize: '14px'
                                        }}>No Image Available</div>
                                    )}

                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#111827',
                                        marginBottom: '8px',
                                        lineHeight: '1.4'
                                    }}>{book?.title || 'Untitled Book'}</h3>

                                    <p style={{
                                        fontSize: '14px',
                                        color: '#6b7280',
                                        marginTop: 'auto',
                                        marginBottom: '0'
                                    }}>{authorNames}</p>
                                </Link>
                            )
                        })
                    )}
                </div>
            </div>

        </main>
    )
}