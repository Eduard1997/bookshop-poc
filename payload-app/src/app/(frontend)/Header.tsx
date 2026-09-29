import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { HeaderCartIcon } from './HeaderCartIcon'
import { ProfileDropdown } from './ProfileDropdown'

export default async function Header() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const { user } = await payload.auth({ headers: await headers() })

    const pagesData = await payload.find({
        collection: 'pages',
    })

    const pages = pagesData.docs

    return (
        <header style={{ background: 'rgba(128, 128, 128, 0.1)', borderBottom: '1px solid rgba(128, 128, 128, 0.2)', padding: '1rem 2rem' }}>
            <nav style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
                    Home
                </Link>

                {pages.map((page) => (
                    <Link key={page.id} href={`/${page.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {page.title}
                    </Link>
                ))}

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {user ? (
                        <div style={{
                            paddingRight: '1.5rem',
                            marginRight: '0.5rem',
                            borderRight: '1px solid rgba(128, 128, 128, 0.3)',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <ProfileDropdown />
                        </div>
                    ) : (
                        <Link
                            href="/auth/login"
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                fontWeight: '500',
                                fontSize: '0.9rem'
                            }}
                        >
                            Authenticate
                        </Link>
                    )}
                    <HeaderCartIcon />
                </div>
            </nav>
        </header>
    )
}