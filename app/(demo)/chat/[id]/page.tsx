'use client'

import ChatInputBox from '@/app/_components/ChatInputBox'
import {
  createChatMessage,
  getChatSession,
  saveChatSession,
  streamChat,
  subscribeChatSessions,
  toBackendHistory,
} from '@/app/_lib/chat'
import type { ChatMessage, ChatProgressNode, ChatSession, ChatStreamEvent } from '@/app/_lib/chat'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { ChatView } from './_components/ChatView'
import { LLMChat } from './_components/LLMChat'
import { UserChat } from './_components/UserChat'

function updateSessionTimestamp (session: ChatSession): ChatSession {
  return {
    ...session,
    updatedAt: new Date().toISOString(),
  }
}

function getErrorMessage (error: unknown) {
  if (error instanceof Error) return error.message

  return '답변 생성 중 오류가 발생했습니다.'
}

function getStateAnswer (patch: unknown) {
  if (typeof patch !== 'object' || patch === null) return null

  if ('answer_text' in patch && typeof patch.answer_text === 'string') {
    return patch.answer_text
  }

  if (
    'clarification_question' in patch &&
    typeof patch.clarification_question === 'string'
  ) {
    return patch.clarification_question
  }

  return null
}

function getProgressLabel (node: string | undefined) {
  const labels: Record<ChatProgressNode, string> = {
    classify: '상황을 파악하는 중...',
    clarify: '추가 확인이 필요한지 살피는 중...',
    retrieve: '관련 문서를 검색하는 중...',
    guide: '대응 절차를 정리하는 중...',
    settlement: '합의금 단서를 확인하는 중...',
    generate: '답변을 작성하는 중...',
    post_check: '답변을 검토하는 중...',
    fallback: '안내 가능한 범위를 확인하는 중...'
  }

  if (node !== undefined && node in labels) {
    return labels[node as ChatProgressNode]
  }

  return '답변을 준비하는 중...'
}

function getProgressNode (node: string | undefined): ChatProgressNode | undefined {
  if (
    node === 'classify' ||
    node === 'clarify' ||
    node === 'retrieve' ||
    node === 'guide' ||
    node === 'settlement' ||
    node === 'generate' ||
    node === 'post_check' ||
    node === 'fallback'
  ) {
    return node
  }

  return undefined
}

export default function ChatPage () {
  const params = useParams<{ id: string }>()
  const sessionId = params.id
  const session = useSyncExternalStore(
    subscribeChatSessions,
    () => getChatSession(sessionId) ?? null,
    () => null
  )
  const [isStreaming, setIsStreaming] = useState(false)
  const streamedMessageIdsRef = useRef<Set<string>>(new Set())
  const abortControllerRef = useRef<AbortController | null>(null)

  const persistSession = useCallback((nextSession: ChatSession) => {
    saveChatSession(nextSession)
  }, [])

  const updateAssistantMessage = useCallback((
    assistantId: string,
    updater: (message: ChatMessage) => ChatMessage
  ) => {
    const currentSession = getChatSession(sessionId)

    if (currentSession === undefined) return

    const nextSession = updateSessionTimestamp({
      ...currentSession,
      messages: currentSession.messages.map((message) => (
        message.id === assistantId ? updater(message) : message
      ))
    })

    saveChatSession(nextSession)
  }, [sessionId])

  const startAssistantResponse = useCallback(async (
    userMessage: ChatMessage,
    requestMessages: ChatMessage[]
  ) => {
    if (streamedMessageIdsRef.current.has(userMessage.id)) return

    streamedMessageIdsRef.current.add(userMessage.id)
    abortControllerRef.current?.abort()

    const abortController = new AbortController()
    const assistantMessage: ChatMessage = {
      ...createChatMessage('assistant', '', 'streaming'),
      progressNode: 'classify',
      progressLabel: getProgressLabel('classify')
    }
    const sessionBeforeRequest = getChatSession(sessionId)

    if (sessionBeforeRequest === undefined) return

    persistSession(updateSessionTimestamp({
      ...sessionBeforeRequest,
      messages: [...requestMessages, assistantMessage]
    }))
    setIsStreaming(true)
    abortControllerRef.current = abortController

    try {
      await streamChat({
        sessionId,
        userQuery: userMessage.content,
        history: toBackendHistory(
          requestMessages.filter((message) => message.id !== userMessage.id)
        ),
        signal: abortController.signal,
        onEvent: (event: ChatStreamEvent) => {
          if (event.type === 'meta' && event.data.phase === 'start') {
            updateAssistantMessage(assistantMessage.id, (message) => ({
              ...message,
              progressNode: getProgressNode(event.data.node),
              progressLabel: getProgressLabel(event.data.node)
            }))
          }

          if (event.type === 'token') {
            updateAssistantMessage(assistantMessage.id, (message) => ({
              ...message,
              content: `${message.content}${event.data.text ?? ''}`
            }))
          }

          if (event.type === 'error') {
            updateAssistantMessage(assistantMessage.id, (message) => ({
              ...message,
              status: 'error',
              progressNode: undefined,
              progressLabel: undefined,
              error: event.data.message ?? '답변 생성 중 오류가 발생했습니다.'
            }))
          }

          if (event.type === 'state') {
            const stateAnswer = getStateAnswer(event.data.patch)

            if (stateAnswer !== null) {
              updateAssistantMessage(assistantMessage.id, (message) => ({
                ...message,
                content: stateAnswer
              }))
            }
          }

          if (event.type === 'done') {
            updateAssistantMessage(assistantMessage.id, (message) => ({
              ...message,
              status: undefined,
              progressNode: undefined,
              progressLabel: undefined
            }))
          }
        }
      })
    } catch (error) {
      if (abortController.signal.aborted) return

      const message = getErrorMessage(error)

      updateAssistantMessage(assistantMessage.id, (currentMessage) => ({
        ...currentMessage,
        content: currentMessage.content.length > 0 ? currentMessage.content : message,
        status: 'error',
        progressNode: undefined,
        progressLabel: undefined,
        error: message
      }))
    } finally {
      if (!abortController.signal.aborted) {
        setIsStreaming(false)
      }
    }
  }, [persistSession, sessionId, updateAssistantMessage])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (session === null || isStreaming) return

    const lastMessage = session.messages.at(-1)

    if (lastMessage?.role === 'user') {
      const timeoutId = window.setTimeout(() => {
        startAssistantResponse(lastMessage, session.messages).catch(() => {})
      }, 0)

      return () => window.clearTimeout(timeoutId)
    }
  }, [isStreaming, session, startAssistantResponse])

  function handleSend (message: string) {
    if (session === null || isStreaming) return

    const userMessage = createChatMessage('user', message)
    const nextSession = updateSessionTimestamp({
      ...session,
      messages: [...session.messages, userMessage]
    })

    persistSession(nextSession)
    startAssistantResponse(userMessage, nextSession.messages).catch(() => {})
  }

  function handleRetry (assistantMessage: ChatMessage) {
    if (session === null || isStreaming) return

    const assistantIndex = session.messages.findIndex((message) => (
      message.id === assistantMessage.id
    ))
    const previousUserMessage = [...session.messages]
      .slice(0, assistantIndex)
      .reverse()
      .find((message) => message.role === 'user')

    if (previousUserMessage === undefined) return

    streamedMessageIdsRef.current.delete(previousUserMessage.id)

    const requestMessages = session.messages
      .slice(0, assistantIndex)
      .filter((message) => message.id !== assistantMessage.id)
    const nextSession = updateSessionTimestamp({
      ...session,
      messages: requestMessages
    })

    persistSession(nextSession)
    startAssistantResponse(previousUserMessage, requestMessages).catch(() => {})
  }

  if (session === null) {
    return (
      <main className='flex flex-1 flex-col items-center justify-center gap-4 bg-app-bg px-6 text-center text-app-text'>
        <p className='text-lg font-semibold'>대화를 찾을 수 없습니다.</p>
        <Link
          href='/'
          className='rounded-md bg-action px-4 py-2 text-sm font-semibold text-action-text hover:bg-action-hover'
        >
          새 채팅 시작
        </Link>
      </main>
    )
  }

  return (
    <main className='flex flex-1 flex-col overflow-hidden bg-app-bg text-app-text'>
      <ChatView>
        {session.messages.map((message) => (
          message.role === 'user'
            ? (
              <UserChat key={message.id} text={message.content} />
              )
            : (
              <LLMChat
                key={message.id}
                text={message.content}
                isStreaming={message.status === 'streaming'}
                isError={message.status === 'error'}
                progressLabel={message.progressLabel}
                onRetry={() => handleRetry(message)}
              />
              )
        ))}
      </ChatView>

      <div className='w-full max-w-3xl px-6 pb-6 mx-auto shrink-0'>
        <ChatInputBox
          disabled={isStreaming}
          onSend={handleSend}
          placeholder={isStreaming ? '답변을 기다리는 중입니다' : '이어서 질문해보세요'}
        />
      </div>
    </main>
  )
}
