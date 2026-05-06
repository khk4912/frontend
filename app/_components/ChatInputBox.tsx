'use client'

import { SendHorizontal } from 'lucide-react'
import { useImperativeHandle, useRef, useState } from 'react'
import type { KeyboardEvent, Ref } from 'react'

export type ChatInputBoxHandle = {
  setMessage: (message: string) => void
  focus: () => void
}

type ChatInputBoxProps = {
  onSend: (message: string) => void
  placeholder?: string
  ref?: Ref<ChatInputBoxHandle>
}

function normalizeMessage (message: string) {
  return message.replace(/\u00a0/g, ' ').trim()
}

export default function ChatInputBox ({
  onSend,
  placeholder = '무엇이든 물어보세요',
  ref,
}: ChatInputBoxProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState('')

  const canSend = normalizeMessage(draft).length > 0

  function setMessage (message: string) {
    if (editorRef.current === null) return

    editorRef.current.textContent = message
    setDraft(message)
  }

  function focusEditor () {
    editorRef.current?.focus()
  }

  function clearEditor () {
    if (editorRef.current === null) return

    editorRef.current.textContent = ''
    setDraft('')
  }

  function handleSend () {
    const content = normalizeMessage(draft)
    if (content.length === 0) return

    onSend(content)
    clearEditor()
    focusEditor()
  }

  function handleKeyDown (event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' || event.shiftKey) return

    event.preventDefault()
    handleSend()
  }

  useImperativeHandle(ref, () => ({
    setMessage,
    focus: focusEditor,
  }))

  return (
    <div className='flex items-center gap-3 rounded-4xl border border-zinc-700 bg-zinc-800 px-5 py-4'>
      <div
        ref={editorRef}
        contentEditable
        role='textbox'
        aria-label='채팅 메시지 입력'
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onInput={(event) => setDraft(event.currentTarget.innerText)}
        onKeyDown={handleKeyDown}
        className='min-h-10 max-h-40 flex-1 overflow-y-auto whitespace-pre-wrap break-words py-1.5 text-base leading-7 text-zinc-100 outline-none empty:before:pointer-events-none empty:before:text-zinc-500 empty:before:content-[attr(data-placeholder)]'
      />
      <button
        type='button'
        aria-label='메시지 전송'
        disabled={!canSend}
        onClick={handleSend}
        className='flex size-10 cursor-pointer items-center justify-center rounded-full bg-zinc-100 text-zinc-950 transition-colors duration-200 hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500'
      >
        <SendHorizontal size={18} />
      </button>
    </div>
  )
}
