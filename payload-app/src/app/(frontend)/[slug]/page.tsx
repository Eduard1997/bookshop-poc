import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

import type { Metadata } from 'next'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const unwrappedParams = await props.params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  const pageData = await payload.find({
    collection: 'pages',
    where: { slug: { equals: unwrappedParams.slug } },
  })

  const page = pageData.docs[0]

  return {
    title: page ? page.title : 'Page Not Found',
  }
}


export default async function Page(props: {params: Promise<{slug: string}>}) {
  const unwrappedParams= await props.params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const pageData = await payload.find({collection: 'pages', where: { slug: { equals: unwrappedParams.slug } }})
  const page = pageData.docs[0]

  if (!page) {
    return (
      <div>
        <h1>404 - Page not found</h1>
      </div>
    )
  }

  return (
    
    <div>
      <h2>{page.title}</h2>
      
      <div>
        <h3>Raw Page Content:</h3>
        <div>
          {JSON.stringify(page.content, null, 2)}
        </div>
      </div>
    </div>
  )
}