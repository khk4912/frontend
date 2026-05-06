'use client'

import Link from 'next/link'
import { Bot, PencilLine } from 'lucide-react'

const chats = [
  {
    title: '과실비율 질문',
    isActive: true,
  },
  {
    title: '합의금 계산 상담',
    isActive: false,
  },
  {
    title: '보험사 대응 문안',
    isActive: false,
  },
]

type ChatItemProps = {
  title: string
  summary?: string
  isActive?: boolean
}

function ChatItem ({ title, isActive = false }: ChatItemProps) {
  return (
    <li>
      <button
        type='button'
        className={`
          flex w-full cursor-pointer items-center gap-3 rounded-md 
          px-3 py-2.5 text-left transition-colors duration-200 ${
          isActive
            ? 'bg-zinc-800 text-zinc-50'
            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
        }`}
      >
        <span className='min-w-0'>
          <span className='block text-sm font-medium truncate'>{title}</span>
          {/* <span className='block text-xs truncate text-zinc-500'>{summary}</span> */}
        </span>
      </button>
    </li>
  )
}

export default function AppSidebar () {
  return (
    <nav className='flex flex-col h-screen px-3 py-4 border-r w-72 border-zinc-800 bg-zinc-900 text-zinc-100'>
      <div className='flex items-center gap-3 px-2 mb-5'>
        <div className='flex items-center justify-center rounded-md size-9 bg-zinc-100 text-zinc-950'>
          <Bot size={20} />
        </div>
        <div className='min-w-0'>
          <h2 className='text-base font-semibold truncate'>교톡</h2>
        </div>
      </div>

      <Link
        href='/'
        className='mb-6 flex w-full items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors duration-200 hover:bg-white'
      >
        <PencilLine size={17} />
        <span>새 채팅</span>
      </Link>

      <section className='flex-1 min-h-0'>
        <div className='px-2 mb-2 text-xs font-medium text-zinc-500'>
          최근 대화
        </div>
        <ul className='space-y-1'>
          {chats.map((chat) => (
            <ChatItem
              key={chat.title}
              title={chat.title}
              isActive={chat.isActive}
            />
          ))}
        </ul>
      </section>

    </nav>
  )
}
