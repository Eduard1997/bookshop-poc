import React from 'react'
import './styles.css'
import Header from './Header'
import { CartProvider } from './CartContext'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'BookStore',
}



export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
        <body>
            <CartProvider><Header />
            <main>{children}</main>
            </CartProvider>
        </body>
    </html>
  )
}
