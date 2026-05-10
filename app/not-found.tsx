import Link from 'next/link'
export default function NotFound () {
  return (
    <main className='flex flex-1 flex-col items-center justify-center gap-4 bg-app-bg px-6 text-center text-app-text'>
      <p className='text-lg font-semibold'>대화를 찾을 수 없습니다.</p>
      <Link
        href='/'
        className='rounded-md bg-action px-4 py-2 text-sm font-semibold text-action-text hover:bg-action-hover'
      >
        새 채팅 시작
      </Link>
    </main>
  )
}
