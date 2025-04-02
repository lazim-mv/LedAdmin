
import type { Metadata } from 'next'
import "react-quill/dist/quill.snow.css";
import "./globals.css"

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
    </html>
  )
}