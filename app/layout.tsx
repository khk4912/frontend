import type { Metadata } from 'next'
import { Noto_Sans_KR as NotoSansKR } from 'next/font/google'
import './globals.css'

const NotoKR = NotoSansKR({
  variable: '--font-noto-kr',
})

export const metadata: Metadata = {
  title: '교톡',
  description: '교통사고 과실비율, 합의금 모두 여기에 물어보세요!',

}

export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${NotoKR.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col'>{children}</body>
    </html>
  )
}
