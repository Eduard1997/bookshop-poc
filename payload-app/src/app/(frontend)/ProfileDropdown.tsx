'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProfileIcon } from './ProfileIcon'

export function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('/api/customers/logout', { method: 'POST' })
            setIsOpen(false)
            router.refresh()
        } catch (err) {
            console.error('Logout error:', err)
        }
    }

    return (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none',
                    color: 'inherit'
                }}
            >
                <ProfileIcon />
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        padding: '4px 0',
                        minWidth: '120px',
                        zIndex: 50,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <button
                        onClick={handleLogout}
                        type="button"
                        style={{
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            fontSize: '14px',
                            fontWeight: '500',
                            textAlign: 'left',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}