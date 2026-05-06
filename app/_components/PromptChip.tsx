'use client'

type PromptChipProps = {
  label: string
  onClick: () => void
}

export default function PromptChip ({ label, onClick }: PromptChipProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='cursor-pointer rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-colors duration-200 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-100'
    >
      {label}
    </button>
  )
}
