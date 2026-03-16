import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Background Remover',
  description: 'Remove image backgrounds using remove.bg API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
