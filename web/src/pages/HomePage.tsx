import { tw } from '../styles/tailwindStyles'
import { Link } from 'react-router-dom'
import { CopyServerAddressButton } from '../components/server/CopyServerAddressButton'
import {
  events,
  players,
  screenshots,
  siteContent,
  stories,
} from '../content/siteContent'
import { useAccessPreview } from '../features/access/accessContext'

export function HomePage() {
  const { openJoinPreview } = useAccessPreview()
  const onlinePlayers = players.slice(0, 4)
  const upcomingEvents = events.filter((event) => event.period === 'upcoming')
  const featuredEvent = upcomingEvents[0]

  return (
    <div>
      <section
        className={tw('home-hero page-shell')}
        id="home"
        aria-labelledby="home-title"
      >
        <div className={tw('hero-copy')}>
          <p className={tw('eyebrow')}>
            <span className={tw('status-pip')} aria-hidden="true" />
            {siteContent.server.statusLabel}
          </p>
          <h1 id="home-title">
            A world shaped by <em>the people who play it.</em>
          </h1>
          <p className={tw('hero-intro')}>{siteContent.server.description}</p>
          <div className={tw('hero-actions')}>
            <CopyServerAddressButton address={siteContent.server.address} />
            <button
              className={tw('button-secondary')}
              type="button"
              onClick={openJoinPreview}
            >
              Request Access
            </button>
          </div>
          <p className={tw('preview-disclaimer')}>
            Status and player activity use Phase 1 preview data.
          </p>
        </div>

        <div
          className={tw('hero-settlement')}
          aria-labelledby="featured-settlement-title"
        >
          <div className={tw('settlement-visual')}>
            <img
              className={tw('settlement-image')}
              src={siteContent.settlement.imageSrc}
              alt={siteContent.settlement.imageAlt}
            />
            <span
              className={tw('settlement-corner corner-left')}
              aria-hidden="true"
            />
            <span
              className={tw('settlement-corner corner-right')}
              aria-hidden="true"
            />
          </div>
          <div className={tw('settlement-copy')}>
            <p className={tw('eyebrow')}>Featured settlement</p>
            <div>
              <h2 id="featured-settlement-title">
                {siteContent.settlement.name}
              </h2>
              <span>{siteContent.settlement.coordinates}</span>
            </div>
          </div>
          <div className={tw('settlement-frame-note')}>
            <span>{siteContent.settlement.description}</span>
            <strong>{siteContent.settlement.dimension}</strong>
          </div>
        </div>
      </section>

      <section
        className={tw('home-section players-section')}
        aria-labelledby="players-title"
      >
        <div className={tw('page-shell')}>
          <div className={tw('players-strip-heading')} id="players">
            <p>Live from the server</p>
            <h2 id="players-title">{onlinePlayers.length} players online</h2>
          </div>
          <div className={tw('player-preview-grid')}>
            {onlinePlayers.map((player) => (
              <article
                className={tw('player-preview')}
                data-testid="player-preview"
                key={player.username}
              >
                <div
                  className={tw('player-avatar')}
                  style={{ backgroundColor: player.color }}
                  aria-hidden="true"
                >
                  {player.initials}
                </div>
                <div>
                  <h3>{player.username}</h3>
                  <p>{player.role}</p>
                </div>
                <span className={tw('player-location')}>{player.location}</span>
              </article>
            ))}
          </div>
          <Link className={tw('players-strip-link')} to="/players">
            View all players <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </section>

      <section
        className={tw('home-section map-section')}
        aria-labelledby="map-title"
      >
        <div className={tw('page-shell')}>
          <SectionHeading
            eyebrow="World survey"
            title="Explore the known world"
            description="A static atlas preview reserves this space for the live BlueMap integration arriving in Phase 2."
            titleId="map-title"
            anchorId="map"
          />
          <div className={tw('map-window')}>
            <div className={tw('map-window-toolbar')}>
              <span className={tw('map-window-title')}>
                <span aria-hidden="true" />
                Goon Squad world map
              </span>
              <div className={tw('map-window-controls')} aria-hidden="true">
                <span>-</span>
                <span>o</span>
                <span>+</span>
              </div>
            </div>
            <div
              className={tw('map-preview')}
              role="img"
              aria-label="Stylised placeholder map with rivers, routes, and settlement markers"
            >
              <div className={tw('map-contours')} aria-hidden="true" />
              <span className={tw('map-river')} aria-hidden="true" />
              <span className={tw('map-road road-north')} aria-hidden="true" />
              <span className={tw('map-road road-south')} aria-hidden="true" />
              <span className={tw('map-place place-main')}>
                Main settlement
              </span>
              <span className={tw('map-place place-quarry')}>Old quarry</span>
              <span className={tw('map-place place-harbour')}>
                Western harbour
              </span>
              <span className={tw('map-scale')}>Preview map / Not live</span>
            </div>
            <div className={tw('map-window-footer')}>
              <span>Static atlas preview / Not live</span>
              <Link to="/map">
                Explore the full world <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className={tw('community-section')}>
        <div className={tw('page-shell community-grid')}>
          <section
            className={tw('home-section stories-section')}
            aria-labelledby="stories-title"
          >
            <div className={tw('story-ledger-heading')} id="stories">
              <div>
                <p className={tw('eyebrow')}>From the archive</p>
                <h2 id="stories-title">Recent stories</h2>
              </div>
              <Link to="/stories">
                Read the archive <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
            <div className={tw('story-ledger')}>
              {stories.slice(0, 3).map((story, index) => (
                <article className={tw('story-ledger-entry')} key={story.slug}>
                  <span className={tw('story-number')}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className={tw('story-meta')}>
                      Archive entry /{' '}
                      <time dateTime={story.publishedAt}>
                        {story.dateLabel}
                      </time>
                    </p>
                    <h3>{story.title}</h3>
                    <p>{story.excerpt}</p>
                  </div>
                  <p className={tw('story-author')}>
                    <span aria-hidden="true">{story.author.charAt(0)}</span>
                    By {story.author}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            className={tw('home-section events-section')}
            aria-labelledby="events-title"
          >
            {featuredEvent ? (
              <article className={tw('featured-event')} id="events">
                <div className={tw('featured-event-inner')}>
                  <p className={tw('eyebrow')}>Next on the calendar</p>
                  <h2 id="events-title">{featuredEvent.title}</h2>
                  <time
                    className={tw('featured-event-date')}
                    dateTime={featuredEvent.startsAt}
                  >
                    <strong>{featuredEvent.dateLabel}</strong>
                    <span>{featuredEvent.timeLabel}</span>
                  </time>
                  <p className={tw('featured-event-description')}>
                    {featuredEvent.description}
                  </p>
                  <p className={tw('featured-event-organiser')}>
                    <span aria-hidden="true">
                      {featuredEvent.organiser.charAt(0)}
                    </span>
                    Organised by {featuredEvent.organiser}
                  </p>
                  <Link className={tw('featured-event-link')} to="/events">
                    View event details
                  </Link>
                </div>
              </article>
            ) : null}
          </section>
        </div>
      </div>

      <section
        className={tw('home-section screenshots-section')}
        aria-labelledby="screenshots-title"
      >
        <div className={tw('page-shell')}>
          <SectionHeading
            eyebrow="From the archive"
            title="Recent screenshots"
            description="Replaceable views from around the server, ready for the managed gallery in Phase 7."
            linkTo="/screenshots"
            linkLabel="Open the gallery"
            titleId="screenshots-title"
            anchorId="screenshots"
          />
          <div className={tw('screenshot-preview-grid')}>
            {screenshots.slice(0, 4).map((screenshot) => (
              <article className={tw('screenshot-preview')} key={screenshot.id}>
                <div
                  className={tw('screenshot-artwork')}
                  data-tone={screenshot.tone}
                  role="img"
                  aria-label={screenshot.alt}
                />
                <div>
                  <h3>{screenshot.title}</h3>
                  <p>
                    {screenshot.contributor} /{' '}
                    <time dateTime={screenshot.capturedAt}>
                      {screenshot.dateLabel}
                    </time>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
  linkTo?: string
  linkLabel?: string
  titleId: string
  anchorId: string
}

function SectionHeading({
  eyebrow,
  title,
  description,
  linkTo,
  linkLabel,
  titleId,
  anchorId,
}: SectionHeadingProps) {
  return (
    <div className={tw('section-heading')} id={anchorId}>
      <div>
        <p className={tw('eyebrow')}>{eyebrow}</p>
        <h2 id={titleId}>{title}</h2>
      </div>
      <p>{description}</p>
      {linkTo && linkLabel ? (
        <Link className={tw('section-link')} to={linkTo}>
          {linkLabel}
          <span aria-hidden="true">-&gt;</span>
        </Link>
      ) : null}
    </div>
  )
}
