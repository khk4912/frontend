import { useEffect } from 'react'

type ChatViewProps = { children: React.ReactNode }
export function ChatView ({ children }: ChatViewProps) {
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, [])

  return (
    <div id='chat-container' className='flex flex-col flex-1 w-full min-h-0 gap-10 py-10 overflow-y-auto text-app-text'>
      <div className='px-20 w-full flex flex-col gap-10'>
        {children}
      </div>

    </div>
  )
}
