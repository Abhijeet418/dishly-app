import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import '@/globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dishly - Modern Recipe Manager',
  description: 'Create, share, and manage your favorite recipes with Dishly. Beautiful, simple, and powerful recipe management.',
  keywords: 'recipes, cooking, recipe manager, meal planning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-white font-sans">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
