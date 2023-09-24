import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '🔋',
  description: 'EV Charging Stations (BIT)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} dark:bg-neutral-900 dark:text-white`}
      >
        {children}
      </body>
    </html>
  )
}
