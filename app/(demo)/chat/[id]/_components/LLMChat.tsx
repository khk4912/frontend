import type { Citation, RetrievedDoc } from '@/app/_lib/chat'
import { LucideCopy, RefreshCwIcon, Share2Icon } from 'lucide-react'
import { useMemo } from 'react'
import { defaultUrlTransform } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

type ReferencedDoc = {
  markerIdx: number
  doc: RetrievedDoc
}

function getDocsByMarker (
  citations: Citation[] | undefined,
  retrievedDocs: RetrievedDoc[] | undefined
) {
  const docsByMarker = new Map<number, RetrievedDoc>()
  if (citations === undefined || retrievedDocs === undefined) return docsByMarker

  const docsById = new Map(retrievedDocs.map((doc) => [doc.doc_id, doc]))

  for (const citation of citations) {
    const doc = docsById.get(citation.doc_id)
    if (doc === undefined) continue

    docsByMarker.set(citation.marker_idx, doc)
  }

  return docsByMarker
}

function markCitationPreviews (
  text: string,
  docsByMarker: Map<number, RetrievedDoc>
) {
  if (docsByMarker.size === 0) return text

  return text.replace(/\[(\d+)\]/g, (match, rawMarker) => {
    const markerIdx = Number(rawMarker)

    if (!docsByMarker.has(markerIdx)) return match

    return `[${rawMarker}](citation:${rawMarker})`
  })
}

function CitationPreview ({ markerIdx, doc }: ReferencedDoc) {
  return (
    <span className='group relative inline-flex align-baseline'>
      <button
        type='button'
        className='mx-0.5 inline-flex translate-y-[-1px] items-center rounded bg-blue-500/10 px-1.5 py-0.5 text-xs font-semibold text-blue-600 transition-colors duration-200 hover:bg-blue-500/15 focus-visible:bg-blue-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 dark:text-blue-300'
        aria-label={`참고 문서 ${markerIdx}: ${doc.title}`}
      >
        [{markerIdx}]
      </button>
      <span className='pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-80 max-w-[calc(100vw-3rem)] -translate-x-1/2 rounded-md border border-app-border bg-panel p-3 text-left text-sm leading-6 text-app-text shadow-xl group-focus-within:block group-hover:block'>
        <span className='mb-1 flex items-center gap-2'>
          <span className='rounded bg-blue-500/10 px-1.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-300'>
            [{markerIdx}]
          </span>
          <span className='rounded bg-surface-muted px-1.5 py-0.5 text-xs text-app-muted'>
            {doc.type}
          </span>
        </span>
        <span className='block font-semibold text-app-text'>{doc.title}</span>
        <span className='mt-1 block text-app-muted'>{doc.content}</span>
        <span className='mt-2 block text-xs text-app-subtle'>
          유사도 {doc.score.toFixed(3)}
        </span>
      </span>
    </span>
  )
}

function transformMarkdownUrl (url: string) {
  if (url.startsWith('citation:')) return url

  return defaultUrlTransform(url)
}

export function LLMChat ({
  text,
  isStreaming = false,
  isError = false,
  progressLabel,
  retrievedDocs,
  citations,
  onRetry,
}: {
  text: string
  isStreaming?: boolean
  isError?: boolean
  progressLabel?: string
  retrievedDocs?: RetrievedDoc[]
  citations?: Citation[]
  onRetry?: () => void
}) {
  const hasText = text.length > 0
  const statusText = progressLabel ?? '답변을 작성하고 있어요...'
  const docsByMarker = useMemo(
    () => getDocsByMarker(citations, retrievedDocs),
    [citations, retrievedDocs]
  )
  const renderedMarkdown = useMemo(
    () => markCitationPreviews(text, docsByMarker),
    [docsByMarker, text]
  )
  const markdownComponents: Components = {
    h2: ({ children }) => (
      <h2 className='mt-5 text-lg font-bold first:mt-0'>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className='mt-4 text-base font-semibold'>{children}</h3>
    ),
    p: ({ children }) => (
      <p className='my-2 leading-7'>{children}</p>
    ),
    ul: ({ children }) => (
      <ul className='my-2 list-disc space-y-1 pl-5'>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className='my-2 list-decimal space-y-1 pl-5'>{children}</ol>
    ),
    li: ({ children }) => (
      <li className='leading-7'>{children}</li>
    ),
    strong: ({ children }) => (
      <strong className='font-semibold text-app-text'>{children}</strong>
    ),
    hr: () => (
      <hr className='my-5 border-app-border' />
    ),
    a: ({ href, children }) => {
      if (href?.startsWith('citation:') === true) {
        const markerIdx = Number(href.slice('citation:'.length))
        const doc = docsByMarker.get(markerIdx)

        if (doc === undefined) return <>{children}</>

        return (
          <CitationPreview markerIdx={markerIdx} doc={doc} />
        )
      }

      return (
        <a
          href={href}
          target='_blank'
          rel='noreferrer'
          className='font-medium underline underline-offset-2'
        >
          {children}
        </a>
      )
    }
  }

  return (
    <div className='flex max-w-[88%] flex-col self-start py-2'>
      {isStreaming && !hasText
        ? (
          <ProgressStatus label={statusText} />
          )
        : (
          <div className={`break-words ${isError ? 'text-red-500' : ''}`}>
            {hasText
              ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                  urlTransform={transformMarkdownUrl}
                >
                  {renderedMarkdown}
                </ReactMarkdown>
                )
              : '답변을 불러오지 못했습니다.'}
          </div>
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
