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
    <div id='chat-container' className='flex flex-col flex-1 w-full max-w-3xl min-h-0 gap-10 px-6 py-10 mx-auto overflow-y-auto text-app-text'>
      {children}
    </div>
  )
}
