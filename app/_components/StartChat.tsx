'use client'

import { useRef, useSyncExternalStore } from 'react'

import ChatInputBox from './ChatInputBox'
import type { ChatInputBoxHandle } from './ChatInputBox'
import PromptChip from './PromptChip'

const promptSuggestions = [
  '과실비율이 뭔가요?',
  '합의금은 어떻게 정해지나요?',
  '보험사가 합의를 거부하면 어떻게 하나요?',
  '합의서 작성 시 주의할 점은?',
  '경미한 사고도 신고해야 하나요?',
]

function getGreeting () {
  const hour = new Date().getHours()

  if (hour >= 5 && hour <= 11) return '좋은 아침이에요.'
  if (hour >= 12 && hour <= 17) return '좋은 오후예요.'
  return '좋은 저녁이에요.'
}

function subscribeToGreeting () {
  return () => {}
}

function getServerGreeting () {
  return '안녕하세요.'
}

export default function StartChat () {
  const chatInputRef = useRef<ChatInputBoxHandle>(null)
  const greeting = useSyncExternalStore(
    subscribeToGreeting,
    getGreeting,
    getServerGreeting
  )

  function handlePromptClick (prompt: string) {
    chatInputRef.current?.setMessage(prompt)
    chatInputRef.current?.focus()
  }

  function handleSend (message: string) {
    return message
  }

  return (
    <div className='mx-auto flex h-full w-full max-w-3xl flex-col justify-center gap-10 px-6 text-white'>
      <section className='flex flex-col items-start gap-1'>
        <p className='text-zinc-400'>{greeting}</p>
        <h1 className='text-3xl font-bold'>무엇을 도와드릴까요?</h1>
        <p className='mt-1.5 text-sm text-zinc-500'>
          교통사고 과실비율과 합의금, 법률 용어까지 쉽게 알려드려요.
        </p>
      </section>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap gap-2'>
          {promptSuggestions.map((prompt) => (
            <PromptChip
              key={prompt}
              label={prompt}
              onClick={() => handlePromptClick(prompt)}
            />
          ))}
        </div>
        <ChatInputBox
          ref={chatInputRef}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}
