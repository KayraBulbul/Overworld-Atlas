import { PageMasthead } from '../components/content/PageMasthead'
import { players } from '../content/siteContent'

export function PlayersPage() {
  return (
    <>
      <PageMasthead
        index="01"
        eyebrow="Player ledger"
        title="Everyone online"
        description="A full preview roster of the players currently represented around the world."
        note="Names, locations, and statistics are static Phase 1 fixtures."
      />
      <section className="page-shell page-content" aria-label="Online players">
        <div className="ledger-heading">
          <p>
            <span className="status-pip" aria-hidden="true" />
            {players.length} players online
          </p>
          <span>Preview roster</span>
        </div>
        <div className="player-ledger">
          {players.map((player, index) => (
            <article
              className="player-record"
              data-testid="player-record"
              key={player.username}
            >
              <span className="record-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div
                className="player-avatar player-avatar-large"
                style={{ backgroundColor: player.color }}
                aria-hidden="true"
              >
                {player.initials}
              </div>
              <div className="player-identity">
                <h2>{player.username}</h2>
                <p>
                  {player.role} / {player.location}
                </p>
              </div>
              <dl className="player-stats">
                <div>
                  <dt>Playtime</dt>
                  <dd>{player.stats.playtime}</dd>
                </div>
                <div>
                  <dt>Deaths</dt>
                  <dd>{player.stats.deaths}</dd>
                </div>
                <div>
                  <dt>Travelled</dt>
                  <dd>{player.stats.distance}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
