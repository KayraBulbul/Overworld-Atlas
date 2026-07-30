import * as Dialog from '@radix-ui/react-dialog'

type JoinApplicationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JoinApplicationDialog({
  open,
  onOpenChange,
}: JoinApplicationDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="access-dialog join-dialog">
          <Dialog.Close className="dialog-close" aria-label="Close application">
            <CloseIcon />
          </Dialog.Close>

          <div className="dialog-heading">
            <p className="eyebrow">Whitelisted survival</p>
            <Dialog.Title>Request passage</Dialog.Title>
            <Dialog.Description className="dialog-description">
              Preview the future application for this private server. Fields can
              be explored, but nothing is submitted or saved during Phase 1.
            </Dialog.Description>
          </div>

          <div className="join-details" aria-label="Application details">
            <div>
              <span>Review</span>
              <strong>Manual</strong>
            </div>
            <div>
              <span>Version</span>
              <strong>To be confirmed</strong>
            </div>
            <div>
              <span>Client</span>
              <strong>Fabric / Mods pending</strong>
            </div>
          </div>

          <form
            className="application-preview-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="minecraft-username">
              Minecraft Java username
              <input
                id="minecraft-username"
                name="minecraftUsername"
                autoComplete="off"
                placeholder="Your in-game name"
              />
            </label>

            <label htmlFor="introduction">
              Introduction or connection to the group
              <textarea
                id="introduction"
                name="introduction"
                rows={4}
                placeholder="Tell us a little about yourself"
              />
            </label>

            <label className="rules-agreement" htmlFor="rules-agreement">
              <input
                id="rules-agreement"
                name="rulesAgreement"
                type="checkbox"
              />
              <span>
                I agree to follow the server rules when their final wording is
                published.
              </span>
            </label>

            <div className="application-actions">
              <button className="discord-preview-button" type="button" disabled>
                Continue with Discord
              </button>
              <button className="submit-preview-button" type="submit" disabled>
                Submit application
              </button>
            </div>

            <p className="application-disabled-note" role="note">
              Applications are not yet accepted through this site. Discord
              identification and submission arrive in Phase 6.
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}
