import '../ui/global.css'

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth';
import { CartProvider } from '@/contexts/cart';

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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
