'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Book = {
    id: string
    title: string
    authors?: { name: string; role?: string }[]
    coverImageUrl?: string
    category?: string
}

export default function BookCatalog({ products }: { products: Book[] }) {
    const router = useRouter()

    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc'>('title-asc')

    const [currentPage, setCurrentPage] = useState<number>(1)
    const ITEMS_PER_PAGE = 3

    const categories = useMemo(() => {
        const cats = products
            .map((p) => p.category)
            .filter((c): c is string => Boolean(c))
        return Array.from(new Set(cats))
    }, [products])

    const quickCategories = useMemo(() => {
        return categories.slice(0, 4)
    }, [categories])

    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'all') return products
        return products.filter((book) => book.category === selectedCategory)
    }, [products, selectedCategory])

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            if (sortBy === 'title-asc') {
                return (a.title || '').localeCompare(b.title || '')
            }
            if (sortBy === 'title-desc') {
                return (b.title || '').localeCompare(a.title || '')
            }
            return 0
        })
    }, [filteredProducts, sortBy])

    const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE) || 1
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return sortedProducts.slice(start, start + ITEMS_PER_PAGE)
    }, [sortedProducts, currentPage])

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat)
        setCurrentPage(1)
    }

    const handleSortChange = (sort: 'title-asc' | 'title-desc') => {
        setSortBy(sort)
        setCurrentPage(1)
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '16px',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '16px'
            }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', marginRight: '6px' }}>Filter:</span>

                    <button
                        onClick={() => handleCategoryChange('all')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: selectedCategory === 'all' ? '#4f46e5' : '#f3f4f6',
                            color: selectedCategory === 'all' ? '#ffffff' : '#374151',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}>All Books ({products.length})</button>

                    {quickCategories.map((cat) => {
                        const isSelected = selectedCategory === cat
                        return (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                title={cat}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: isSelected ? '#4f46e5' : '#f3f4f6',
                                    color: isSelected ? '#ffffff' : '#374151',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >{cat}</button>
                        )
                    })}

                    <button
                        onClick={() => router.push('/books')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#4f46e5',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            marginLeft: '4px',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>Browse all categories →</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label htmlFor="sort-select" style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                        Sort:
                    </label>
                    <select
                        id="sort-select"
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value as any)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            backgroundColor: '#ffffff',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#111827',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="title-asc">Title: A - Z</option>
                        <option value="title-desc">Title: Z - A</option>
                    </select>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '20px'
            }}>
                {paginatedProducts.length === 0 ? (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#6b7280', padding: '40px 0' }}>No books found in this category.</p>
                ) : (
                    paginatedProducts.map((book: any, index: number) => {
                        const authorNames = book?.authors?.map((a: any) => a.name).filter(Boolean).join(', ') || 'Unknown Author'
                        const categoryName = book?.category || 'Uncategorized'
                        const bookId = book?.id || index

                        return (
                            <Link
                                key={bookId}
                                href={`/books/${book?.id}`}
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
                                            height: '260px',
                                            objectFit: 'cover',
                                            borderRadius: '6px',
                                            marginBottom: '12px',
                                            backgroundColor: '#f3f4f6'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '260px',
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
                            </Link>
                        )
                    })
                )}
            </div>

            {totalPages > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px',
                    marginTop: '40px',
                    paddingTop: '20px',
                    borderTop: '1px solid #f3f4f6'
                }}>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            backgroundColor: currentPage === 1 ? '#f3f4f6' : '#4f46e5',
                            color: currentPage === 1 ? '#9ca3af' : '#ffffff',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}> ← Previous </button>

                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Page {currentPage} of {totalPages}</span>

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#4f46e5',
                            color: currentPage === totalPages ? '#9ca3af' : '#ffffff',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    > Next → </button>
                </div>
            )}
        </div>
    )
}