import React from 'react'
import Link from 'next/link'

export const BannerBlock = ({ banner, featuredBook }: { banner: any, featuredBook?: any }) => {
    if (!banner.isActive) return null

    return (
        <div style={{
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            padding: '28px 36px',
            borderRadius: '12px',
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '32px',
            flexWrap: 'wrap'
        }}>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0', lineHeight: '1.2' }}>
                    {banner.heading}
                </h2>
                
                {banner.subheading && (
                    <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.5', color: '#e0e7ff' }}>
                        {banner.subheading}
                    </p>
                )}

                {banner.link && (
                    <div style={{ marginTop: '4px' }}>
                        <a
                            href={banner.link}
                            style={{
                                display: 'inline-block',
                                backgroundColor: '#ffffff',
                                color: '#4f46e5',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}
                        >
                            Learn More
                        </a>
                    </div>
                )}
            </div>

            {featuredBook && (
                <Link
                    href={`/books/${featuredBook.id}`}
                    style={{ 
                        width: '140px',
                        flexShrink: 0,
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        color: '#111827',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.15s ease'
                    }}
                >
                    {featuredBook?.coverImageUrl ? (
                        <img
                            src={featuredBook.coverImageUrl}
                            alt={featuredBook?.title || 'Book cover'}
                            style={{
                                width: '100%',
                                aspectRatio: '2/3',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                marginBottom: '10px',
                                backgroundColor: '#f3f4f6'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            aspectRatio: '2/3',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '4px',
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#9ca3af',
                            fontSize: '10px'
                        }}>No image</div>
                    )}

                    <span style={{ fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', color: '#4f46e5', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {featuredBook?.category || 'Uncategorized'}
                    </span>

                    <h3 style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 2px 0', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {featuredBook?.title || 'Untitled'}
                    </h3>

                    <p style={{ fontSize: '11px', color: '#16a34a', margin: '0', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {featuredBook?.authors?.map((a: any) => a.name).filter(Boolean).join(', ') || 'Unknown Author'}
                    </p>
                </Link>
            )}
        </div>
    )
}