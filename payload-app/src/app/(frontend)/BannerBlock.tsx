import React from 'react'
import Link from 'next/link'

export const BannerBlock = ({ banner, featuredBook }: { banner: any, featuredBook?: any }) => {
    if (!banner.isActive) return null

    return (
        <div style={{
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            padding: '36px 48px 36px 40px',
            borderRadius: '12px',
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            gap: '40px',
            flexWrap: 'wrap'
        }}>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '0', lineHeight: '1.2' }}>
                    {banner.heading}
                </h2>
                
                {banner.subheading && (
                    <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.6', color: '#e0e7ff' }}>
                        {banner.subheading}
                    </p>
                )}

                {banner.link && (
                    <div style={{ marginTop: '8px' }}>
                        <a
                            href={banner.link}
                            style={{
                                display: 'inline-block',
                                backgroundColor: '#ffffff',
                                color: '#4f46e5',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '15px'
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
                        width: 'clamp(160px, 35%, 220px)',
                        flexShrink: 0,
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        color: '#111827',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.15s ease'
                    }}
                >
                    {featuredBook?.coverImageUrl ? (
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                            <img
                                src={featuredBook.coverImageUrl}
                                alt={featuredBook?.title || 'Book cover'}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '180px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    marginBottom: '12px',
                                    backgroundColor: '#f3f4f6'
                                }}
                            />
                        </div>
                    ) : (
                        <div style={{
                            width: '100%',
                            flexGrow: 1,
                            minHeight: '180px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '4px',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#9ca3af',
                            fontSize: '12px'
                        }}>No image</div>
                    )}

                    <span style={{ 
                        fontSize: '10px', 
                        fontWeight: '600', 
                        textTransform: 'uppercase', 
                        color: '#4f46e5', 
                        marginBottom: '4px', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                    }}>
                        {featuredBook?.category || 'Uncategorized'}
                    </span>

                    <h3 style={{ 
                        fontSize: '14px', 
                        fontWeight: '700', 
                        margin: '0 0 4px 0', 
                        lineHeight: '1.3', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden' 
                    }}>
                        {featuredBook?.title || 'Untitled'}
                    </h3>

                    <p style={{ 
                        fontSize: '12px', 
                        color: '#16a34a', 
                        margin: '0', 
                        fontWeight: '500', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                    }}>
                        {featuredBook?.authors?.map((a: any) => a.name).filter(Boolean).join(', ') || 'Unknown Author'}
                    </p>
                </Link>
            )}
        </div>
    )
}