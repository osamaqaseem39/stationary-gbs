import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import './globals.css'
import { RecentlyViewedProvider } from '@/contexts/RecentlyViewedContext'
import { AnalyticsProvider } from '@/contexts/AnalyticsContext'
import { CustomerProvider } from '@/contexts/CustomerContext'
import { CartProvider } from '@/contexts/CartContext'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import WhatsAppButton from '@/components/WhatsAppButton'

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})
const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Gujrat Book Shop - Stationery & Books',
  description: 'Your trusted source for books, stationery, and educational supplies. Discover our wide collection of textbooks, notebooks, pens, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable} font-sans`}>
        <CustomerProvider>
          <AnalyticsProvider>
            <CartProvider>
              <RecentlyViewedProvider>
                {children}
                <CookieConsentBanner />
                <WhatsAppButton />
              </RecentlyViewedProvider>
            </CartProvider>
          </AnalyticsProvider>
        </CustomerProvider>
      </body>
    </html>
  )
}