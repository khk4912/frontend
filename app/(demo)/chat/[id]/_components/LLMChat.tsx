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

function ProgressStatus ({ label }: { label: string }) {
  return (
    <span className='chat-progress-status'>
      <span className='chat-progress-dot' aria-hidden='true' />
      <span>{label}</span>
    </span>
  )
}

export function LLMChat ({
  text,
  isStreaming = false,
  isError = false,
  progressLabel,
  onRetry,
}: {
  text: string
  isStreaming?: boolean
  isError?: boolean
  progressLabel?: string
  onRetry?: () => void
}) {
  const hasText = text.length > 0
  const statusText = progressLabel ?? '답변을 작성하고 있어요...'

  return (
    <div className='flex max-w-[88%] flex-col self-start py-2'>
      {isStreaming && !hasText
        ? (
          <ProgressStatus label={statusText} />
          )
        : (
          <span className={`whitespace-pre-line break-words ${isError ? 'text-red-500' : ''}`}>
            {hasText ? text : '답변을 불러오지 못했습니다.'}
          </span>
          )}
      {isStreaming && hasText && progressLabel !== undefined && (
        <div className='mt-4'>
          <ProgressStatus label={progressLabel} />
        </div>
      )}
      {(hasText || isError) && (
        <div className='flex justify-start mt-2 -ml-2'>
          <ToolButton label='답변 복사' icon={<LucideCopy size={16} />} />
          <ToolButton label='답변 공유' icon={<Share2Icon size={16} />} />
          <ToolButton
            label={isError ? '답변 재시도' : '답변 다시 생성'}
            icon={<RefreshCwIcon size={16} />}
            onClick={onRetry}
          />
        </div>
      )}
    </div>
  )
}
