'use client'

import { SessionProvider as Provider } from 'next-auth/react'

type Props = {
  children: React.ReactNode
}

export function NextAuthProvider({ children }: Props) {
  return <Provider>{children}</Provider>
} 