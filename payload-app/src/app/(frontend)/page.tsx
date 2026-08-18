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
        <BookCatalog products={products} />
      </div>
    </main>
  )
}