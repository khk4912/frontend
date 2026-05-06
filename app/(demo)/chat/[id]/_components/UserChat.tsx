type UserChatProps = { text: string }
export function UserChat ({ text }: UserChatProps) {
  return (
    <div className='self-end px-4 py-2 text-white bg-blue-600 rounded-2xl'>
      <span className='whitespace-pre-line'>{text}</span>
    </div>
  )
}
