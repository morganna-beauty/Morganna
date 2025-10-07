'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface QueryProviderProps {
  children: ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
    () =>
        new QueryClient({
        defaultOptions: {
            queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            },
        },
        }),
    )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
