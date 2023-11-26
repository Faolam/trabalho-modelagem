import { Inter } from 'next/font/google'
import '../ui/global.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'GaBrownie',
  description: 'Brownies',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
