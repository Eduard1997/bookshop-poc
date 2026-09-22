import React from 'react'

export const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <img 
      src="/favicon.ico" 
      alt="BookShop Icon" 
      style={{ height: '48px', width: '48px', objectFit: 'contain' }} 
    />
    <span style={{ 
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      fontWeight: 800, 
      fontSize: '48px', 
      color: '#6366f1' 
    }}>
      BookShop
    </span>
  </div>
)

export const Icon = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
    <img 
      src="/favicon.ico" 
      alt="BookShop Icon" 
      style={{ height: '24px', width: '24px', objectFit: 'contain' }} 
    />
  </div>
)