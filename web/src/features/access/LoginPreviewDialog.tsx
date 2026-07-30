import * as Dialog from '@radix-ui/react-dialog'

type LoginPreviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginPreviewDialog({
  open,
  onOpenChange,
}: LoginPreviewDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="access-dialog login-dialog">
          <Dialog.Close
            className="dialog-close"
            aria-label="Close login preview"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </Dialog.Close>
          <p className="eyebrow">Member access</p>
          <Dialog.Title>Log in as a returning member</Dialog.Title>
          <Dialog.Description className="dialog-description">
            Normal Discord login will restore an existing community account. It
            will never create or submit a server application.
          </Dialog.Description>
          <button className="discord-preview-button" type="button" disabled>
            Log In with Discord
          </button>
          <p className="application-disabled-note" role="note">
            Member login arrives in Phase 5. To apply for server access, close
            this notice and choose Join.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
