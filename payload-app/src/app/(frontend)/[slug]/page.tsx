import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'

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
    const unwrappedParams = await props.params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const pageData = await payload.find({
        collection: 'pages', 
        where: { slug: { equals: unwrappedParams.slug } }
    })
    const page = pageData.docs[0]

    if (!page) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontFamily: 'system-ui, sans-serif' }}>
                <h1>404 - Page not found</h1>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', fontFamily: 'system-ui, sans-serif' }}>
            <h2 style={{ fontSize: '3rem', margin: '0 0 2rem 0', fontWeight: '800', letterSpacing: '-0.02em', textAlign: 'left', borderBottom: '1px solid rgba(128, 128, 128, 0.2)', paddingBottom: '1rem' }}>
                {page.title}
            </h2>
            
            {page.content && (
                <div style={{ lineHeight: '1.8', fontSize: '1.125rem', opacity: 0.9, textAlign: 'left', color: 'inherit' }}>
                    <RichText data={page.content as any} />
                </div>
            )}
        </div>
    )
}