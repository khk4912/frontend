import { LucideCopy, RefreshCwIcon, Share2Icon } from 'lucide-react'

function ToolButton ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      className='p-2 rounded-full cursor-pointer text-app-muted hover:bg-surface-muted'
    >
      {icon}
    </button>
  )
}

export function LLMChat ({
  text,
  isStreaming = false,
  isError = false,
  onRetry,
}: {
  text: string
  isStreaming?: boolean
  isError?: boolean
  onRetry?: () => void
}) {
  const displayText = text.length > 0
    ? text
    : isStreaming
      ? '답변을 작성하고 있어요...'
      : '답변을 불러오지 못했습니다.'

  return (
    <div className='flex max-w-[88%] flex-col self-start py-2'>
      <span className={`whitespace-pre-line break-words ${isError ? 'text-red-500' : ''}`}>
        {displayText}
      </span>
      <div className='flex justify-start mt-2 -ml-2'>
        <ToolButton label='답변 복사' icon={<LucideCopy size={16} />} />
        <ToolButton label='답변 공유' icon={<Share2Icon size={16} />} />
        <ToolButton
          label={isError ? '답변 재시도' : '답변 다시 생성'}
          icon={<RefreshCwIcon size={16} />}
          onClick={onRetry}
        />
      </div>
    </div>
  )
}
