import { useState } from 'react'
import type { ReactNode } from 'react'
import { AccessPreviewContext } from './accessContext'
import { JoinApplicationDialog } from './JoinApplicationDialog'
import { LoginPreviewDialog } from './LoginPreviewDialog'

type OpenDialog = 'join' | 'login' | null

export function AccessPreviewProvider({ children }: { children: ReactNode }) {
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null)

  return (
    <AccessPreviewContext
      value={{
        openJoinPreview: () => setOpenDialog('join'),
        openLoginPreview: () => setOpenDialog('login'),
      }}
    >
      {children}
      <JoinApplicationDialog
        open={openDialog === 'join'}
        onOpenChange={(isOpen) => setOpenDialog(isOpen ? 'join' : null)}
      />
      <LoginPreviewDialog
        open={openDialog === 'login'}
        onOpenChange={(isOpen) => setOpenDialog(isOpen ? 'login' : null)}
      />
    </AccessPreviewContext>
  )
}
