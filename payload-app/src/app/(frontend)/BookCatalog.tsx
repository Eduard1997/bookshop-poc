'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { PriceDetails, AvailabilityDetails } from '@/lib/emporix'

type Book = {
    id: string
    title: string
    authors?: { name: string; role?: string }[]
    coverImageUrl?: string
    category?: string
    price?: PriceDetails | null
    availability?: AvailabilityDetails | null
}

type FilterConfig = {
    filterType: 'category' | 'author' | 'priceRange'
    enabled?: boolean | null
}

type PageLayoutSettings = {
    cardsPerRow?: string | null
    defaultSort?: 'title-asc' | 'title-desc' | null
    filters?: FilterConfig[] | null
    cardStyle?: 'compact' | 'detailed' | null
}

const PRICE_BUCKETS = [
    { label: 'Under 20 EUR', value: 'under-20', min: 0, max: 20 },
    { label: '20 - 50 EUR', value: '20-50', min: 20, max: 50 },
    { label: 'Over 50 EUR', value: 'over-50', min: 50, max: Infinity },
]

function getBookPrice(book: Book): number {
    return book.price?.amount ?? 0
}

export default function BookCatalog({ products, layout }: { products: Book[]; layout: PageLayoutSettings }) {
    const router = useRouter()

    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedAuthor, setSelectedAuthor] = useState<string>('all')
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all')
    const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc'>(layout?.defaultSort ?? 'title-asc')

    const [currentPage, setCurrentPage] = useState<number>(1)
    const ITEMS_PER_PAGE = 10

    const cardsPerRow = layout?.cardsPerRow ?? '3'
    const isDetailed = layout?.cardStyle === 'detailed'

    const orderedFilters = useMemo(() => {
        return (layout?.filters ?? [])
            .filter((f) => f.enabled)
            .map((f) => f.filterType)
    }, [layout])

    const showCategoryFilter = orderedFilters.includes('category')
    const showAuthorFilter = orderedFilters.includes('author')
    const showPriceFilter = orderedFilters.includes('priceRange')

    const categories = useMemo(() => {
        const cats = products.map((p) => p.category).filter((c): c is string => Boolean(c))
        return Array.from(new Set(cats))
    }, [products])

    const quickCategories = useMemo(() => categories.slice(0, 4), [categories])

    const authors = useMemo(() => {
        const names = products.flatMap((p) => p.authors?.map((a) => a.name) ?? []).filter(Boolean) as string[]
        return Array.from(new Set(names))
    }, [products])

    const quickAuthors = useMemo(() => authors.slice(0, 4), [authors])

    const filteredProducts = useMemo(() => {
        let result = products

        if (selectedCategory !== 'all') {
            result = result.filter((book) => book.category === selectedCategory)
        }

        if (selectedAuthor !== 'all') {
            result = result.filter((book) => book.authors?.some((a) => a.name === selectedAuthor))
        }

        if (selectedPriceRange !== 'all') {
            const bucket = PRICE_BUCKETS.find((b) => b.value === selectedPriceRange)
            if (bucket) {
                result = result.filter((book) => {
                    const price = getBookPrice(book)
                    const inRange = price >= bucket.min && price < bucket.max
                    const inStock = book.availability?.available === true
                    return inRange && inStock
                })
            }
        }

        return result
    }, [products, selectedCategory, selectedAuthor, selectedPriceRange])

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '')
            if (sortBy === 'title-desc') return (b.title || '').localeCompare(a.title || '')
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

    const handleAuthorChange = (author: string) => {
        setSelectedAuthor(author)
        setCurrentPage(1)
    }

    const handlePriceChange = (range: string) => {
        setSelectedPriceRange(range)
        setCurrentPage(1)
    }

    const handleSortChange = (sort: 'title-asc' | 'title-desc') => {
        setSortBy(sort)
        setCurrentPage(1)
    }

    const filterPillStyle = (isSelected: boolean) => ({
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: isSelected ? '#4f46e5' : '#f3f4f6',
        color: isSelected ? '#ffffff' : '#374151',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap' as const,
    })

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '16px',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '16px'
            }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {orderedFilters.map((filterType) => {
                        if (filterType === 'category' && showCategoryFilter) {
                            return (
                                <div key="category" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', marginRight: '6px' }}>Category:</span>
                                    <button onClick={() => handleCategoryChange('all')} style={filterPillStyle(selectedCategory === 'all')}>
                                        All ({products.length})
                                    </button>
                                    {quickCategories.map((cat) => (
                                        <button key={cat} onClick={() => handleCategoryChange(cat)} title={cat} style={filterPillStyle(selectedCategory === cat)}>
                                            {cat}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => router.push('/books')}
                                        style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '8px 12px' }}
                                    >Browse all categories →</button>
                                </div>
                            )
                        }

                        if (filterType === 'author' && showAuthorFilter) {
                            return (
                                <div key="author" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', marginRight: '6px' }}>Author:</span>
                                    <button onClick={() => handleAuthorChange('all')} style={filterPillStyle(selectedAuthor === 'all')}>
                                        All
                                    </button>
                                    {quickAuthors.map((author) => (
                                        <button key={author} onClick={() => handleAuthorChange(author)} title={author} style={filterPillStyle(selectedAuthor === author)}>
                                            {author}
                                        </button>
                                    ))}
                                </div>
                            )
                        }

                        if (filterType === 'priceRange' && showPriceFilter) {
                            return (
                                <div key="priceRange" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', marginRight: '6px' }}>Price:</span>
                                    <button onClick={() => handlePriceChange('all')} style={filterPillStyle(selectedPriceRange === 'all')}>
                                        All
                                    </button>
                                    {PRICE_BUCKETS.map((bucket) => (
                                        <button key={bucket.value} onClick={() => handlePriceChange(bucket.value)} style={filterPillStyle(selectedPriceRange === bucket.value)}>
                                            {bucket.label}
                                        </button>
                                    ))}
                                    {selectedPriceRange !== 'all' && (
                                        <span style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>(out-of-stock books hidden)</span>
                                    )}
                                </div>
                            )
                        }

                        return null
                    })}
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
                gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)`,
                gap: '20px'
            }}>
                {paginatedProducts.length === 0 ? (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#6b7280', padding: '40px 0' }}>No books found matching these filters.</p>
                ) : (
                    paginatedProducts.map((book: any, index: number) => {
                        const authorNames = book?.authors?.map((a: any) => a.name).filter(Boolean).join(', ') || 'Unknown Author'
                        const categoryName = book?.category || 'Uncategorized'
                        const bookId = book?.id || index

                        return (
                            <Link
                                key={bookId} href={`/books/${book?.id}`}
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

                                {isDetailed && (
                                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', lineHeight: '1.4' }}>ID: {bookId}</p>
                                )}
                            </Link>
                        )
                    })
                )}
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: '10px 20px', borderRadius: '6px', border: '1px solid #d1d5db',
                            backgroundColor: currentPage === 1 ? '#f3f4f6' : '#4f46e5',
                            color: currentPage === 1 ? '#9ca3af' : '#ffffff',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '14px', fontWeight: '600', transition: 'all 0.2s'
                        }}> ← Previous </button>

                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Page {currentPage} of {totalPages}</span>

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '10px 20px', borderRadius: '6px', border: '1px solid #d1d5db',
                            backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#4f46e5',
                            color: currentPage === totalPages ? '#9ca3af' : '#ffffff',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontSize: '14px', fontWeight: '600', transition: 'all 0.2s'
                        }}
                    > Next → </button>
                </div>
            )}
        </div>
    )
}