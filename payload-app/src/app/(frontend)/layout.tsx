import React from 'react'
import './styles.css'
import Header from './Header'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'BookStore',
}



export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
        <body>
            <Header />
            <main>{children}</main>
        </body>
    </html>
  )
}
