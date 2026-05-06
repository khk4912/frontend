import type { Metadata } from 'next'
import localFont from 'next/font/local'

import './globals.css'
import AppSidebar from './_components/AppSideBar'

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: '교톡',
  description: '교통사고 과실비율, 합의금은 이제 교톡에서!',

}

export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ko'
      className={`${pretendard.className} h-full antialiased`}
    >
      <body className='flex min-h-full'>
        <aside>
          <AppSidebar />
        </aside>
        {children}
      </body>
    </html>
  )
}
