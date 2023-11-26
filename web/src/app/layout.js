import { Inter } from 'next/font/google'
import '../ui/global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GaBrownie',
  description: 'Brownies',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
