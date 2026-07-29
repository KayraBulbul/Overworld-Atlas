import { createContext, use } from 'react'

export type AccessPreviewContextValue = {
  openJoinPreview: () => void
  openLoginPreview: () => void
}

export const AccessPreviewContext =
  createContext<AccessPreviewContextValue | null>(null)

export function useAccessPreview() {
  const context = use(AccessPreviewContext)

  if (!context) {
    throw new Error(
      'useAccessPreview must be used within AccessPreviewProvider',
    )
  }

  return context
}
