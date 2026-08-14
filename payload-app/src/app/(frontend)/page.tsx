import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import Link from 'next/link'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  const myPages = await payload.find({collection: 'pages'})
  const myLists = await payload.find({collection: 'curated-lists'})

  return (
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
        </div>
      </div>
      <div className="footer">
        <p>Update this page by editing</p>
        <a className="codeLink" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}
