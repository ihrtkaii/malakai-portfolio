import type { Metadata } from 'next'
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://malakai.dev'),
  title: 'Malakai — SOC Analyst Portfolio',
  description:
    'Cybersecurity portfolio of Malakai. Security+, Network+, building toward SOC analyst roles.',
  openGraph: {
    title: 'Malakai — SOC Analyst Portfolio',
    description: 'An immersive cybersecurity workstation experience.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${plusJakartaSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
