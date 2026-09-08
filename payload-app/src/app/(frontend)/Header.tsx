import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { HeaderCartIcon } from './HeaderCartIcon'

export default async function Header() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const pagesData = await payload.find({
        collection: 'pages',
    })

    const pages = pagesData.docs

    return (
        <header style={{ background: 'rgba(128, 128, 128, 0.1)', borderBottom: '1px solid rgba(128, 128, 128, 0.2)', padding: '1rem 2rem' }}>
            <nav style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '2rem' }}>
                <Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
                    Home
                </Link>
                <Link href="/discover" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
                    Discover
                </Link>

                {pages.map((page) => (
                    <Link
                        key={page.id}
                        href={`/${page.slug}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {page.title}
                    </Link>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <HeaderCartIcon />
                </div>
            </nav>
        </header>
    )
}