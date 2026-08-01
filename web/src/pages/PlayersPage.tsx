import { tw } from '../styles/tailwindStyles'
import { PageMasthead } from '../components/content/PageMasthead'
import { PlayerHead } from '../features/server-status/PlayerHead'
import { getServerStatusPresentation } from '../features/server-status/serverStatusPresentation'
import { useServerStatus } from '../features/server-status/useServerStatus'

export function PlayersPage() {
  const statusQuery = useServerStatus()
  const status = getServerStatusPresentation(
    statusQuery.data,
    statusQuery.isPending
      ? 'loading'
      : statusQuery.isError
        ? 'error'
        : 'success',
  )

  return (
    <>
      <PageMasthead
        index="01"
        eyebrow="Player ledger"
        title="Currently online"
        description="Players positively identified by the Minecraft server's current public status sample."
        note="The complete community directory arrives with the Phase 3 database."
      />
      <section
        className={tw('page-shell page-content')}
        aria-label="Online players"
      >
        <div className={tw('ledger-heading')}>
          <p>
            <span
              className={tw('status-pip')}
              data-state={status.tone}
              aria-hidden="true"
            />
            {status.playerHeading}
          </p>
          <span>{status.reportedPlayerCount}</span>
        </div>
        {status.statusDetail ? (
          <p className={tw('player-ledger-detail')}>{status.statusDetail}</p>
        ) : null}
        {status.confirmedPlayers.length > 0 ? (
          <div className={tw('player-ledger')}>
            {status.confirmedPlayers.map((player, index) => (
              <article
                className={tw('player-record')}
                data-testid="player-record"
                key={player.uuid}
              >
                <span className={tw('record-number')} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <PlayerHead uuid={player.uuid} size="large" />
                <div className={tw('player-identity')}>
                  <h2>{player.username}</h2>
                  <p>Confirmed by the current server sample</p>
                </div>
                <p className={tw('player-presence')}>Online now</p>
              </article>
            ))}
          </div>
        ) : (
          <div
            className={tw('player-ledger-message')}
            data-state={status.tone}
            role={statusQuery.isError ? 'alert' : 'status'}
            aria-busy={statusQuery.isPending ? true : undefined}
          >
            <p className={tw('eyebrow')}>Live player status</p>
            <strong>{status.playerHeading}</strong>
            <p>{status.playerMessage}</p>
            {status.canRetry ? (
              <button
                className={tw('content-state-action')}
                type="button"
                onClick={() => void statusQuery.refetch()}
              >
                Try again
              </button>
            ) : null}
          </div>
        )}
      </section>
    </>
  )
}
