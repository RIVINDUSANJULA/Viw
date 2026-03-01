import { type ReactNode } from 'react'
import TopNav from './TopNav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
        <TopNav/>
        <main>{children}</main>
    </div>
  )
}
