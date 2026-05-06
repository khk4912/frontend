'use client'

import ChatInputBox from '@/app/_components/ChatInputBox'
import { ChatView } from './_components/ChatView'
import { UserChat } from './_components/UserChat'
import { LLMChat } from './_components/LLMChat'

export default function ChatPage () {
  return (
    <main className='flex flex-col flex-1 overflow-hidden text-app-text'>
      <ChatView>
        <UserChat text='안녕하세요, 사용자님!' />
        <LLMChat text='안녕하세요! 무엇을 도와드릴까요?' />
        <UserChat text='넌 무엇을 할 수 있니?' />
        <LLMChat text='저는 교통사고 관련 질문에 답변해드릴 수 있어요. 과실비율, 합의금 계산, 사고 처리 절차 등 궁금한 점이 있으면 무엇이든 저에게 물어보세요!' />
        <UserChat text='교통사고 과실비율이 뭐야?' />
        <LLMChat text='과실비율은 교통사고에서 각 당사자의 책임 정도를 백분율로 나타낸 것입니다. 예를 들어, A와 B가 사고를 냈을 때 A의 과실이 70%이고 B의 과실이 30%라면, A는 사고에 대한 책임이 더 크다는 것을 의미합니다. 과실비율은 사고 상황, 증거, 목격자 진술 등을 종합적으로 고려하여 결정됩니다.' />
        <UserChat text='그럼 합의금 계산은 어떻게 해?' />
        <LLMChat text='합의금 계산은 여러 요소에 따라 달라질 수 있지만, 일반적으로 다음과 같은 요소들이 고려됩니다: 1. 치료비: 사고로 인한 의료비용 2. 휴업 손실: 사고로 인해 일을 못하게 된 기간 동안의 소득 손실 3. 위자료: 정신적 고통에 대한 보상 4. 재산 피해: 차량 수리비 등 물적 피해 비용 5. 과실비율: 각 당사자의 책임 정도에 따라 합의금이 조정될 수 있습니다. 정확한 합의금 계산을 위해서는 사고 상황과 관련된 모든 정보를 종합적으로 검토하는 것이 중요합니다.' />
        <UserChat text='나는 오늘 직진 중에 오른쪽에서 갑자기 나타난 차에 부딪혔어. 이런 경우엔 과실 비율이 어떻게 될까?' />
        <LLMChat text='이런 경우에는 일반적으로 직진하던 차량이 우회전하던 차량보다 과실이 적게 나오는 경향이 있습니다. 하지만 정확한 과실비율은 사고 상황에 따라 달라질 수 있습니다. 예를 들어, 우회전하던 차량이 신호를 무시하거나 과속을 했는지, 직진하던 차량이 안전거리를 유지했는지 등의 요소들이 고려됩니다. 일반적으로는 직진하던 차량이 80%의 과실을 받고, 우회전하던 차량이 20%의 과실을 받는 경우가 많지만, 이는 단순한 예시일 뿐 실제 사고에서는 다양한 요소들이 영향을 미칠 수 있습니다.' />
      </ChatView>

      <div className='w-full max-w-3xl px-6 pb-6 mx-auto shrink-0'>
        <ChatInputBox onSend={() => { console.log('send') }} />
      </div>
    </main>
  )
}
