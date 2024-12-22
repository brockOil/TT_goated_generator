import './globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

const timesNewRoman = localFont({
  src: [
    {
      path: '../public/fonts/times-new-roman.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/times-new-roman-bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
})

export const metadata: Metadata = {
  title: 'Timetable Generator',
  description: 'Generate and manage your class timetables easily',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${timesNewRoman.className} font-serif`}>{children}</body>
    </html>
  )
}

