import Link from 'next/link'

export function ProfileIcon() {
    return (
        <Link
            href="/account"
            style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                paddingRight: '1.5rem',
                marginRight: '0.5rem',
                borderRight: '1px solid rgba(128, 128, 128, 0.3)',
            }}
        >
            <svg
                width="28"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" />
            </svg>
        </Link>
    )
}