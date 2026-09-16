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
        <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827', paddingBottom: '60px' }}>
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 40px 2rem 40px' }}>
                <h1 style={{ fontSize: '3rem', margin: '0 0 2rem 0', fontWeight: '800', letterSpacing: '-0.02em', borderBottom: '1px solid rgba(128, 128, 128, 0.2)', paddingBottom: '1rem' }}>
                    {page.title}
                </h1>
                
                {page.content && (
                    <div style={{ lineHeight: '1.8', fontSize: '1.125rem', opacity: 0.9, marginBottom: '3rem' }}>
                        <RichText data={page.content as any} />
                    </div>
                )}
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