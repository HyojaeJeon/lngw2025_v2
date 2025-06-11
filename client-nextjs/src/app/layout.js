
import './globals.css'
import { Inter } from 'next/font/google'
import ClientLayout from './clientLayout'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CRM System",
  description: "Customer Relationship Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
