'use client'

import Link from 'next/link'
import { MenuIcon, PencilLine, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

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

type SidebarContentProps = {
  collapsed: boolean
  onNewChatClick?: () => void
  onHeaderButtonClick: () => void
  toggleLabel: string
  toggleIcon?: 'menu' | 'close'
}

function SidebarContent ({
  collapsed,
  onNewChatClick,
  onHeaderButtonClick,
  toggleLabel,
  toggleIcon = 'menu',
}: SidebarContentProps) {
  const ToggleIcon = toggleIcon === 'close' ? X : MenuIcon

  return (
    <>
      <div
        className={`mb-3 flex ${
          collapsed ? 'flex-col items-center gap-2 px-0' : 'items-center gap-1'
        }`}
      >

        <Image src='/logo.png' alt='Logo' width={40} height={40} />

        {!collapsed && (
          <div className='min-w-0'>
            <h2 className='truncate text-lg font-bold'>교톡</h2>
          </div>
        )}

        <button
          type='button'
          aria-label={toggleLabel}
          onClick={onHeaderButtonClick}
          className={`flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors duration-200 hover:bg-zinc-800 hover:text-zinc-100 ${
            collapsed ? '' : 'ml-auto'
          }`}
        >
          <ToggleIcon size={18} />
        </button>
      </div>

      <Link
        href='/'
        onClick={onNewChatClick}
        className={`mb-3 flex h-10 items-center w-full gap-2 px-3 text-sm font-semibold transition-colors duration-200
                 hover:bg-zinc-800 hover:text-zinc-100 rounded-md
                 ${collapsed ? 'text-zinc-400' : ''}`}
        aria-label='새 채팅'
      >
        <PencilLine size={17} />
        {!collapsed && <span>새 채팅</span>}
      </Link>

      {!collapsed && (
        <section className='min-h-0 flex-1'>
          <div className='mb-2 px-2 text-xs font-medium text-zinc-500'>
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
      )}
    </>
  )
}

export default function AppSidebar () {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const onClickCollapse = () => {
    setCollapsed((prev) => !prev)
  }

  const openMobileSidebar = () => {
    setMobileOpen(true)
  }

  const closeMobileSidebar = () => {
    setMobileOpen(false)
  }

  return (
    <>
      {!mobileOpen && (
        <button
          type='button'
          aria-label='사이드바 열기'
          onClick={openMobileSidebar}
          className='fixed left-4 top-4 z-40 flex size-10 cursor-pointer items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-100 shadow-lg transition-colors duration-200 hover:bg-zinc-800 md:hidden'
        >
          <MenuIcon size={20} />
        </button>
      )}

      {mobileOpen && (
        <button
          type='button'
          aria-label='사이드바 닫기'
          onClick={closeMobileSidebar}
          className='fixed inset-0 z-40 cursor-default bg-zinc-950/70 md:hidden'
        />
      )}

      <nav
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden border-r border-zinc-800 bg-zinc-900 px-3 py-4 text-zinc-100 shadow-2xl transition-transform duration-200 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent
          collapsed={false}
          onNewChatClick={closeMobileSidebar}
          onHeaderButtonClick={closeMobileSidebar}
          toggleLabel='사이드바 닫기'
          toggleIcon='close'
        />
      </nav>

      <nav
        className={`hidden h-screen flex-col overflow-hidden border-r border-zinc-800 bg-zinc-900 px-3 py-4 text-zinc-100 transition-[width] duration-200 ease-in-out md:flex ${
          collapsed ? 'w-16' : 'w-72'
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          onHeaderButtonClick={onClickCollapse}
          toggleLabel={collapsed ? '사이드바 열기' : '사이드바 닫기'}
        />
      </nav>
    </>
  )
}
