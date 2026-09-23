import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { HeaderCartIcon } from './HeaderCartIcon'
import { ProfileIcon } from './ProfileIcon'

// TODO(BSP-57 part 2, after BSP-54)

export default async function Header() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const pagesData = await payload.find({
        collection: 'pages',
    })

    const pages = pagesData.docs

    // TODO: replace with BSP-54 
    const user = null

    return (
        <header style={{ background: 'rgba(128, 128, 128, 0.1)', borderBottom: '1px solid rgba(128, 128, 128, 0.2)', padding: '1rem 2rem' }}>
            <nav style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
                    Home
                </Link>

                {pages.map((page) => (<Link key={page.id} href={`/${page.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>{page.title}</Link>))}

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {user ? (
                        <Link href="/account" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                            <ProfileIcon />
                        </Link>
                    ) : (
                        <Link
                            href="/account"
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                fontWeight: '500',
                                fontSize: '0.9rem'
                            }}
                        >Authenticate</Link>
                    )}
                    <HeaderCartIcon />
                </div>
            </nav>
        </header>
    )
}