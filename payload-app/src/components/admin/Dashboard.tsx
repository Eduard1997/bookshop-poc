import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export async function CustomDashboard() {
  const payload = await getPayload({ config })

  const [bookOverlays, staffPicks, pages] = await Promise.all([
    payload.count({ collection: 'book-overlays' }),
    payload.count({ 
        collection: 'book-overlays',
        where: { staffPick: { equals: true } }
    }),
    payload.count({ collection: 'pages' }),
  ])

  return (
    <div style={{ 
        padding: '48px', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif', 
        color: '#0f172a',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        minHeight: '100vh',
        borderRadius: '24px',
        boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.5)'
    }}>
      <style>{`
        .action-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 20px;
          text-decoration: none;
          color: #0f172a;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .action-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(79, 70, 229, 0.03) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }
        .action-card > * {
          z-index: 1;
        }
        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.03);
          border-color: rgba(99, 102, 241, 0.4);
        }
        .action-card:hover::before {
          opacity: 1;
        }
        .action-card:hover .icon-container {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          border-color: transparent;
          transform: scale(1.05) rotate(3deg);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .metric-card {
          padding: 32px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }
        .metric-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          transform: translate(30%, -30%);
          pointer-events: none;
        }
      `}</style>
      
      <div style={{ marginBottom: '56px', position: 'relative' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '-0.03em', color: '#0f172a', lineHeight: '1.1' }}>
          BookShop Admin
        </h1>
        <p style={{ margin: 0, fontSize: '18px', color: '#64748b', maxWidth: '600px', lineHeight: '1.6' }}>
          Manage your bookstore content, track inventory, and curate the best reading experiences for your customers.
        </p>
      </div>

      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '4px', height: '24px', background: '#6366f1', borderRadius: '4px' }}></div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#0f172a', letterSpacing: '-0.01em' }}>Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <ActionCard 
            title="Add New Book" 
            desc="Expand your catalog"
            href="/admin/collections/book-overlays/create" 
            icon={<BookIcon />} 
          />
          <ActionCard 
            title="Create Banner" 
            desc="Highlight promotions"
            href="/admin/collections/banners/create" 
            icon={<ImageIcon />} 
          />
          <ActionCard 
            title="Build List" 
            desc="Curate collections"
            href="/admin/collections/curated-lists/create" 
            icon={<ListIcon />} 
          />
          <ActionCard 
            title="Create Page" 
            desc="Design new layouts"
            href="/admin/collections/pages/create" 
            icon={<LayoutIcon />} 
          />
        </div>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '4px', height: '24px', background: '#10b981', borderRadius: '4px' }}></div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#0f172a', letterSpacing: '-0.01em' }}>Content Metrics</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <MetricCard title="Total Books" count={bookOverlays.totalDocs} color="#6366f1" />
          <MetricCard title="Staff Picks" count={staffPicks.totalDocs} color="#10b981" />
          <MetricCard title="Live Pages" count={pages.totalDocs} color="#f59e0b" />
        </div>
      </div>

    </div>
  )
}

const ActionCard = ({ title, desc, href, icon }: { title: string, desc: string, href: string, icon: React.ReactNode }) => (
    <Link href={href} className="action-card">
        <div className="icon-container">
            {icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: '700', fontSize: '16px', letterSpacing: '-0.01em' }}>{title}</span>
          <span style={{ fontWeight: '500', fontSize: '13px', color: '#64748b' }}>{desc}</span>
        </div>
    </Link>
)

const MetricCard = ({ title, count, color }: { title: string, count: number, color: string }) => (
    <div className="metric-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', color: '#64748b', fontWeight: '600' }}>
          {title}
        </h3>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}80` }}></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <p style={{ margin: 0, fontSize: '56px', fontWeight: '800', color: '#0f172a', lineHeight: '1', letterSpacing: '-0.02em' }}>
          {count}
        </p>
      </div>
    </div>
)

// SVG Icons
const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
)

const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
)

const ListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </svg>
)

const LayoutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
)
