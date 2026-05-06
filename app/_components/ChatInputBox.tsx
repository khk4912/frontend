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
    <div className='flex items-center gap-3 rounded-4xl border border-app-border bg-panel px-5 py-3'>
      <div
        ref={editorRef}
        contentEditable
        role='textbox'
        aria-label='채팅 메시지 입력'
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onInput={(event) => setDraft(event.currentTarget.innerText)}
        onKeyDown={handleKeyDown}
        className='min-h-10 max-h-40 flex-1 overflow-y-auto whitespace-pre-wrap break-words py-1.5 text-base leading-7 text-app-text outline-none empty:before:pointer-events-none empty:before:text-app-subtle empty:before:content-[attr(data-placeholder)]'
      />
      <button
        type='button'
        aria-label='메시지 전송'
        disabled={!canSend}
        onClick={handleSend}
        className='flex size-10 cursor-pointer items-center justify-center rounded-full bg-action text-action-text transition-colors duration-200 hover:bg-action-hover disabled:cursor-not-allowed disabled:bg-action-disabled disabled:text-action-disabled-text'
      >
        <SendHorizontal size={18} />
      </button>
    </div>
  )
}
