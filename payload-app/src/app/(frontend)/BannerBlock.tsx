import React from 'react'
import Link from 'next/link'

export const BannerBlock = ({ banner, featuredBook }: { banner: any, featuredBook?: any }) => {
    if (!banner.isActive) return null

    return (
        <>
            <style>{`
                .premium-banner {
                    background: linear-gradient(135deg, #0f172a 0%, #3730a3 100%);
                    box-shadow: 0 20px 40px -10px rgba(55, 48, 163, 0.5);
                    position: relative;
                    overflow: hidden;
                }
                .premium-banner::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -10%;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }
                .banner-btn {
                    transition: all 0.2s ease;
                }
                .banner-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(0,0,0,0.3) !important;
                }
                .banner-book {
                    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transform-origin: center;
                }
                .banner-book:hover {
                    transform: scale(1.05) rotate(-3deg) translateY(-5px);
                }
                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .premium-banner {
                        flex-direction: column;
                        align-items: center;
                        padding: 32px 24px;
                    }
                    .premium-banner-text-container {
                        text-align: center;
                    }
                    .banner-btn-container {
                        display: flex;
                        justify-content: center;
                    }
                    .banner-book-container {
                        width: 100%;
                        justify-content: center;
                        height: 240px; /* fixed height for mobile to prevent huge books */
                    }
                }
            `}</style>
            <div className="premium-banner" style={{
                color: '#ffffff',
                padding: '40px 48px',
                borderRadius: '24px',
                marginBottom: '40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'stretch', // crucial for stretching the book
                gap: '40px',
            }}>
                <div className="premium-banner-text-container" style={{ 
                    flex: '1 1 0%', 
                    minWidth: 0, // Critical for text wrapping in flex container
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '20px', 
                    justifyContent: 'center',
                    zIndex: 1,
                }}>
                    <h2 style={{ 
                        fontSize: 'clamp(28px, 4vw, 42px)', 
                        fontWeight: '800', 
                        margin: '0', 
                        lineHeight: '1.1',
                        letterSpacing: '-0.02em',
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        overflowWrap: 'break-word',
                    }}>
                        {banner.heading}
                    </h2>
                    
                    {banner.subheading && (
                        <p style={{ 
                            margin: '0', 
                            fontSize: '17px', 
                            lineHeight: '1.6', 
                            color: '#e0e7ff',
                            display: '-webkit-box',
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            overflowWrap: 'break-word',
                        }}>
                            {banner.subheading}
                        </p>
                    )}

                    {banner.link && (
                        <div className="banner-btn-container" style={{ marginTop: '8px' }}>
                            <a
                                href={banner.link}
                                className="banner-btn"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    backgroundColor: '#ffffff',
                                    color: '#0f172a',
                                    padding: '12px 28px',
                                    borderRadius: '9999px',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    fontSize: '15px',
                                    boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)',
                                }}
                            >
                                Learn More
                            </a>
                        </div>
                    )}
                </div>

                {featuredBook && (
                    <div className="banner-book-container" style={{ 
                        flex: '0 0 auto', 
                        display: 'flex',
                        alignItems: 'stretch',
                        zIndex: 1,
                    }}>
                        <Link
                            href={`/books/${featuredBook.id}`}
                            className="banner-book"
                            style={{ 
                                display: 'flex',
                                textDecoration: 'none',
                                height: '100%',
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                height: '100%',
                            }}>
                                {featuredBook?.coverImageUrl ? (
                                    <img
                                        src={featuredBook.coverImageUrl}
                                        alt={featuredBook?.title || 'Book cover'}
                                        style={{
                                            height: '100%',
                                            width: 'auto',
                                            minHeight: '140px',
                                            maxHeight: '400px',
                                            aspectRatio: '2/3',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            boxShadow: '20px 20px 40px rgba(0,0,0,0.4), -5px 0px 15px rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        height: '100%',
                                        aspectRatio: '2/3',
                                        minHeight: '140px',
                                        maxHeight: '400px',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#c7d2fe',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: '20px 20px 40px rgba(0,0,0,0.3)',
                                    }}>
                                        No Cover
                                    </div>
                                )}
                                <div style={{
                                    position: 'absolute',
                                    left: '0',
                                    top: '0',
                                    bottom: '0',
                                    width: '6px',
                                    background: 'linear-gradient(to right, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
                                    borderRadius: '12px 0 0 12px',
                                }} />
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}