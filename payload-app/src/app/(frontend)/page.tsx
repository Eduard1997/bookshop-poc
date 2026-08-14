import { getPayload } from 'payload'
import config from '@/payload.config'
<<<<<<< Updated upstream
import './styles.css'
import Link from 'next/link'
=======
import React from 'react'

import { getAllProductsFromCatalogViaCategories } from '@/lib/emporix'
import BookCatalog from './BookCatalog'

export const dynamic = 'force-dynamic';
>>>>>>> Stashed changes

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const CATALOG_ID = '6a75cbedd753775031ef0588'
  const products = await getAllProductsFromCatalogViaCategories(CATALOG_ID)

  const myPages = await payload.find({collection: 'pages'})
  const myLists = await payload.find({collection: 'curated-lists'})

  return (
<<<<<<< Updated upstream
    <div className="home">
      <div className="content">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && <h1>Welcome to your new project.</h1>}
        {user && <h1>Welcome back, {user.email}</h1>}
        <div className="links">
          <a
            className="admin"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="docs"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
          <div>
              {myPages.docs.map((page) => (
                <div key={page.id}>
                  <p>{page.title}</p>
                  <Link href={`/${page.slug}`}>
                      Go to page
                  </Link>
                </div>
              ))}
          </div>
          <div>
            {myLists.docs.map((list) => (
              <div key={list.id}>
                <p>{list.title}</p>
                <ul>
                    {list.books?.map((book) => (
                        <li key={book.id}>
                            ISBN: {typeof book.bookOverlay === 'object' && book.bookOverlay !== null ? book.bookOverlay.isbn : 'No ISBN found'}
                        </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
=======
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827', paddingBottom: '60px' }}>

      <div style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '40px 40px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0' }}>Welcome to Bookshop</h1>
>>>>>>> Stashed changes
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '30px auto 0 auto', padding: '0 40px' }}><BookCatalog products={products} /></div>
    </main>
  )
}