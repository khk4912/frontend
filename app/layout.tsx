import type { Metadata } from 'next'
import { Noto_Sans_KR as NotoSansKR } from 'next/font/google'

import './globals.css'
import AppSidebar from './_components/AppSideBar'

const NotoKR = NotoSansKR({
  variable: '--font-noto-kr',
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
      className={`${NotoKR.variable} h-full antialiased`}
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
