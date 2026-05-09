import { LucideCopy, RefreshCwIcon, Share2Icon } from 'lucide-react'

function ToolButton ({ icon }: { icon: React.ReactNode }) {
  return (
    <button className='p-2 rounded-full cursor-pointer text-app-muted hover:bg-surface-muted'>
      {icon}
    </button>
  )
}

export function LLMChat ({ text }: { text: string }) {
  return (
    <div className='flex flex-col self-start py-2'>
      <span className='whitespace-pre-line wrap-break-word'>{text}</span>
      <div className='flex justify-start mt-2 -ml-2'>
        <ToolButton icon={<LucideCopy size={16} />} />
        <ToolButton icon={<Share2Icon size={16} />} />
        <ToolButton icon={<RefreshCwIcon size={16} />} />
      </div>
    </div>
  )
}
