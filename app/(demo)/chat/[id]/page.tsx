'use client'

import ChatInputBox from '@/app/_components/ChatInputBox'
import { ChatView } from './_components/ChatView'
import { UserChat } from './_components/UserChat'
import { LLMChat } from './_components/LLMChat'

export default function ChatPage () {
  return (
    <main className='flex flex-col justify-center flex-1 gap-10 px-12 mb-10 text-app-text'>
      <ChatView>
        <UserChat text='안녕하세요, 사용자님!' />
        <LLMChat text='안녕하세요! 무엇을 도와드릴까요?' />
        <UserChat text='넌 무엇을 할 수 있니?' />
        <LLMChat text='저는 교통사고 관련 질문에 답변해드릴 수 있어요. 과실비율, 합의금 계산, 사고 처리 절차 등 궁금한 점이 있으면 무엇이든 저에게 물어보세요!' />
      </ChatView>
      <ChatInputBox onSend={() => { console.log('send') }} />
    </main>
  )
}
