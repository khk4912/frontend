type ChatViewProps = { children: React.ReactNode }
export function ChatView ({ children }:ChatViewProps) {
  return (
    <div className='flex flex-col w-full h-full max-w-3xl gap-10 px-6 mx-auto mt-20 overflow-y-auto text-app-text'>
      {children}
    </div>
  )
}
