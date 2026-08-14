import React from 'react'
import Link from 'next/link'
import { getCategoriesWithNamesForCatalog } from '../../../lib/emporix'

export const dynamic = 'force-dynamic'

export default async function BooksCategoriesPage() {
    const CATALOG_ID = '6a75cbedd753775031ef0588'
    const categories = await getCategoriesWithNamesForCatalog(CATALOG_ID)

    return (
        <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827', paddingBottom: '60px' }}>

            <div style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '40px 40px' }}>
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
                        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 6px 0', letterSpacing: '0.05em' }}>Books Categories</h1>
                        <p style={{ margin: 0, color: '#e0e7ff', fontSize: '15px' }}>Explore our collection organized by topics</p>
                    </div>

                    <Link
                        href="/"
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
                    >← Back to Home</Link>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '40px auto 0 auto', padding: '0 40px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '20px'
                }}>
                    {categories.map((cat: any) => {
                        const categoryName = cat.localizedName?.en || Object.values(cat.localizedName || {})[0] || cat.id
                        return (
                            <Link
                                key={cat.id}
                                href={`/books/category/${cat.id}`}
                                style={{
                                    padding: '32px 24px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: '#111827',
                                    border: '1px solid #e5e7eb',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                                }}
                            >
                                <span style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', lineHeight: '1.3' }}>{categoryName}</span>
                                <span style={{ fontSize: '13px', color: '#4f46e5', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>View Books →</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}