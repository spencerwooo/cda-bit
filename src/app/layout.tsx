import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '🔋',
  description: 'EV Charging Stations (BIT)',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { sizes: '32x32', url: '/favicon-32x32.png', type: 'image/png' },
      { sizes: '16x16', url: '/favicon-16x16.png', type: 'image/png' },
    ],
    apple: [{ sizes: '180x180', url: '/apple-touch-icon.png' }],
  },
  manifest: 'site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#BECB4D' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
  ],
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
        <Toaster
          toastOptions={{ error: { style: { background: '#fecdd3' } } }}
        />
        {children}
      </body>
    </html>
  )
}
