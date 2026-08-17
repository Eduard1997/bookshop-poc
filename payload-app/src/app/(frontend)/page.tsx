import { getPayload } from 'payload'
import config from '@/payload.config'
import React from 'react'
import Link from 'next/link'

import { getAllProductsFromCatalogViaCategories } from '@/lib/emporix'
import BookCatalog from './BookCatalog'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const CATALOG_ID = '6a75cbedd753775031ef0588'
  const products = await getAllProductsFromCatalogViaCategories(CATALOG_ID)

  const myPages = await payload.find({ collection: 'pages' })
  const myLists = await payload.find({ collection: 'curated-lists' })

  return (
    <main
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        color: '#111827',
        paddingBottom: '60px',
      }}
    >
      <div style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '40px 40px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 10px 0' }}>Welcome to Bookshop</h1>
          <a
            href={payloadConfig.routes.admin}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#e0e7ff', textDecoration: 'underline' }}
          >Go to Admin Panel</a>
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '30px auto 0 auto', padding: '0 40px' }}>
        {myPages.docs.length > 0 && (
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Pages</h2>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {myPages.docs.map((page) => (
                <div
                  key={page.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    padding: '12px 16px',
                    borderRadius: '8px',
                  }}
                >
                  <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>{page.title}</p>
                  <Link
                    href={`/${page.slug}`}
                    style={{ color: '#4f46e5', textDecoration: 'underline' }}
                  >Go to page</Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {myLists.docs.length > 0 && (
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
              Curated Lists
            </h2>
            {myLists.docs.map((list) => (
              <div key={list.id} style={{ marginBottom: '15px' }}>
                <p style={{ fontWeight: '600', margin: '0 0 6px 0' }}>{list.title}</p>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {list.books?.map((book: any) => (
                    <li key={book.id}>
                      ISBN:{' '}
                      {typeof book.bookOverlay === 'object' && book.bookOverlay !== null
                        ? book.bookOverlay.isbn
                        : 'No ISBN found'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <BookCatalog products={products} />
      </div>
    </main>
  )
}