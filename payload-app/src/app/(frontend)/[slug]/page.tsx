import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getAllProductsFromCatalogViaCategories } from '@/lib/emporix'
import { attachPriceAndAvailability } from '@/lib/bookPriceAvailability'
import { BookCard } from '../BookCard'
import { BannerBlock } from '../BannerBlock'
import { CuratedListBlock } from '../CuratedListBlock'

export const dynamic = 'force-dynamic'
const CATALOG_ID = '6a75cbedd753775031ef0588'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const unwrappedParams = await props.params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    
    const pageData = await payload.find({
        collection: 'pages',
        where: { slug: { equals: unwrappedParams.slug } },
    })

    const page = pageData.docs[0]
    return { title: page ? page.title : 'Page Not Found' }
}

async function resolveBooks(bookReferences: any[], allProducts: any[]) {
    const listBooks = bookReferences.map((item) => {
        const overlay = item.bookOverlay || item
        let isbnToFetch = ''

        if (overlay) {
            if (typeof overlay === 'object' && 'isbn' in overlay && overlay.isbn) {
                isbnToFetch = String(overlay.isbn)
            } else if (typeof overlay === 'string' || typeof overlay === 'number') {
                isbnToFetch = String(overlay)
            }
        }

        if (isbnToFetch) {
            const foundBook = allProducts.find(book => String(book.isbn) === isbnToFetch)
            if (foundBook) return foundBook
            
            const fallbackBook = allProducts.find(book => String(book.id) === isbnToFetch)
            return fallbackBook || null
        }
        return null
    }).filter(Boolean)

    return await attachPriceAndAvailability(listBooks)
}

export default async function Page(props: {params: Promise<{slug: string}>}) {
    const unwrappedParams = await props.params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    
    const pageData = await payload.find({
        collection: 'pages', 
        where: { slug: { equals: unwrappedParams.slug } },
        depth: 2 
    })
    const page = pageData.docs[0]

    if (!page) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontFamily: 'system-ui, sans-serif' }}>
                <h1>404 - Page not found</h1>
            </div>
        )
    }

    const allProducts = await getAllProductsFromCatalogViaCategories(CATALOG_ID)

    return (
        <main style={{ 
            backgroundColor: '#f8fafc', 
            minHeight: '100vh', 
            fontFamily: '"Inter", system-ui, sans-serif', 
            color: '#0f172a', 
            paddingBottom: '100px',
            overflowX: 'hidden'
        }}>
            
            {/* Premium Hero Section */}
            <div style={{ 
                position: 'relative',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                padding: '100px 40px 60px 40px',
                marginBottom: '80px',
                boxShadow: '0 10px 40px -20px rgba(0,0,0,0.05)',
            }}>
                {/* Decorative background shapes */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-5%',
                    width: '60vw',
                    height: '60vw',
                    maxWidth: '800px',
                    maxHeight: '800px',
                    background: 'radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
                
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <h1 style={{ 
                        fontSize: 'clamp(40px, 6vw, 64px)', 
                        margin: '0', 
                        fontWeight: '900', 
                        letterSpacing: '-0.04em', 
                        lineHeight: '1.1',
                        background: 'linear-gradient(135deg, #0f172a 0%, #4338ca 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0px 4px 20px rgba(67, 56, 202, 0.15)'
                    }}>
                        {page.title}
                    </h1>
                    
                    {page.content && (
                        <div style={{ 
                            lineHeight: '1.8', 
                            fontSize: '1.25rem', 
                            color: '#475569', 
                            maxWidth: '800px',
                            borderLeft: '4px solid #4f46e5',
                            paddingLeft: '24px',
                            marginTop: '40px',
                            opacity: 0.95
                        }}>
                            <RichText data={page.content as any} />
                        </div>
                    )}
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
                {page.pageLayout && await Promise.all(page.pageLayout.map(async (blockItem: any, index: number) => {
                    const block = blockItem.contentBlock;
                    if (!block || !block.value) return null;

                    if (block.relationTo === 'banners') {
                        const banner = block.value;
                        const resolvedBookArray = banner.featuredBook ? await resolveBooks([banner.featuredBook], allProducts) : [];
                        const featuredBook = resolvedBookArray[0] || null;
                        
                        return <BannerBlock key={`banner-${index}`} banner={banner} featuredBook={featuredBook} />
                    }

                    if (block.relationTo === 'curated-lists') {
                        const list = block.value;
                        const resolvedBooks = await resolveBooks(list.books || [], allProducts);
                        
                        return <CuratedListBlock key={`list-${index}`} list={list} books={resolvedBooks} />
                    }

                    if (block.relationTo === 'book-overlays') {
                        const resolvedSingleBook = await resolveBooks([block.value], allProducts);
                        if (!resolvedSingleBook.length) return null;
                        
                        return (
                            <div key={`single-book-${index}`} style={{ marginBottom: '40px', maxWidth: '300px' }}>
                                <BookCard book={resolvedSingleBook[0]} />
                            </div>
                        )
                    }

                    return null;
                }))}
            </div>
        </main>
    )
}