'use client'

import Link from 'next/link'
import { MenuIcon, PencilLine, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import ThemeToggle from './ThemeToggle'

const chats = [
  {
    title: '과실비율 질문',
    href: '/chat/1',
    isActive: true,
  },
  {
    title: '합의금 계산 상담',
    href: '/chat/2',
    isActive: false,
  },
  {
    title: '보험사 대응 문안',
    href: '/chat/3',
    isActive: false,
  },
]

type ChatItemProps = {
  title: string
  summary?: string
  isActive?: boolean
  href: string
}

function ChatItem ({ title, isActive = false, href }: ChatItemProps) {
  return (
    <Link href={href}>
      <li>
        <div
          className={`
          flex w-full cursor-pointer items-center gap-3 rounded-md 
          px-3 py-2.5 text-left transition-colors duration-200 ${
          isActive
            ? 'bg-surface-muted text-app-text'
            : 'text-app-muted hover:bg-surface-muted hover:text-app-text'
        }`}
        >
          <span className='min-w-0'>
            <span className='block text-sm font-medium truncate'>{title}</span>
            {/* <span className='block text-xs truncate text-zinc-500'>{summary}</span> */}
          </span>
        </div>
      </li>
    </Link>
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
        <Link href='/'>
          <Image src='/logo.png' alt='Logo' width={40} height={40} />
        </Link>

        {!collapsed && (
          <Link href='/' className='min-w-0'>
            <div className='min-w-0'>
              <h2 className='text-lg font-bold truncate'>교톡</h2>
            </div>
          </Link>
        )}

        <button
          type='button'
          aria-label={toggleLabel}
          onClick={onHeaderButtonClick}
          className={`flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-app-muted transition-colors duration-200 hover:bg-surface-muted hover:text-app-text ${
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
                 hover:bg-surface-muted hover:text-app-text rounded-md
                 ${collapsed ? 'text-app-muted' : ''}`}
        aria-label='새 채팅'
      >
        <PencilLine size={17} />
        {!collapsed && <span>새 채팅</span>}
      </Link>

      {!collapsed && (
        <section className='flex-1 min-h-0'>
          <div className='px-2 mb-2 text-xs font-medium text-app-subtle'>
            최근 대화
          </div>
          <ul className='space-y-1'>
            {chats.map((chat) => (
              <ChatItem
                key={chat.title}
                href={chat.href} // TODO: 채팅 상세 페이지 링크로 변경
                title={chat.title}
                isActive={chat.isActive}
              />
            ))}
          </ul>
        </section>
      )}
      {collapsed && <div className='flex-1' />}
      <ThemeToggle />
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
          className='fixed z-40 flex items-center justify-center transition-colors duration-200 border rounded-md shadow-lg cursor-pointer left-4 top-4 size-10 border-app-border bg-panel text-app-text hover:bg-surface-muted md:hidden'
        >
          <MenuIcon size={20} />
        </button>
      )}

      {mobileOpen && (
        <button
          type='button'
          aria-label='사이드바 닫기'
          onClick={closeMobileSidebar}
          className='fixed inset-0 z-40 cursor-default bg-app-overlay md:hidden'
        />
      )}

      <nav
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden border-r border-app-border bg-panel px-3 py-4 text-app-text shadow-2xl transition-transform duration-200 ease-in-out md:hidden ${
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
        className={`hidden h-screen flex-col overflow-hidden border-r border-app-border bg-panel px-3 py-4 text-app-text transition-[width] duration-200 ease-in-out md:flex ${
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
