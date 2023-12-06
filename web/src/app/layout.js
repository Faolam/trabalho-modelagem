import '../ui/global.css'

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth';

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
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
