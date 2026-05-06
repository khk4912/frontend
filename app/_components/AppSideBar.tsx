import Link from 'next/link'
import { PencilLine } from 'lucide-react'

type NavItemProps = {
  icon: React.ReactNode
  label: string
  href: string
}
function NavItem ({ icon, label, href }: NavItemProps) {
  return (
    <li>
      <Link
        href={href}
        className='flex items-center gap-4 rounded-md
                   px-3 py-2 text-gray-700 transition-colors
                   duration-200 hover:bg-gray-200'
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  )
}

export default function AppSidebar () {
  return (
    <nav className='flex h-screen w-64 flex-col border border-r-1 border-gray-100 bg-gray-50 p-4'>
      <h2 className='mb-4 text-xl font-bold'>교톡</h2>

      <ul className='mt-4 space-y-2'>
        <NavItem icon={<PencilLine size={18} />} label='새 채팅' href='/register' />
      </ul>
    </nav>
  )
}
