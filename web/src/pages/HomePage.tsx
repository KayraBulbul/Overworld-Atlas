import { Link } from 'react-router-dom'
import { CopyServerAddressButton } from '../components/server/CopyServerAddressButton'
import {
  events,
  players,
  screenshots,
  siteContent,
  stories,
} from '../content/siteContent'

export function HomePage() {
  const onlinePlayers = players.slice(0, 4)
  const upcomingEvents = events.filter((event) => event.period === 'upcoming')

  return (
    <div id="home">
      <section className="home-hero page-shell" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-pip" aria-hidden="true" />
            {siteContent.server.statusLabel}
          </p>
          <h1 id="home-title">
            A world shaped by <em>the people who play it.</em>
          </h1>
          <p className="hero-intro">{siteContent.server.description}</p>
          <div className="hero-actions">
            <CopyServerAddressButton address={siteContent.server.address} />
            <button className="button-secondary" type="button" disabled>
              Request Access
            </button>
          </div>
          <p className="preview-disclaimer">
            Status and player activity use Phase 1 preview data.
          </p>
        </div>

        <div
          className="hero-atlas"
          aria-label="Illustrated world archive cover"
        >
          <div className="hero-atlas-grid" aria-hidden="true">
            <span className="atlas-route route-one" />
            <span className="atlas-route route-two" />
            <span className="atlas-marker marker-one" />
            <span className="atlas-marker marker-two" />
            <span className="atlas-compass">N</span>
          </div>
          <div className="atlas-caption">
            <span>Private Fabric survival</span>
            <strong>World archive</strong>
            <small>Est. many bad ideas ago</small>
          </div>
        </div>
      </section>

      <section
        className="home-section players-section"
        id="players"
        aria-labelledby="players-title"
      >
        <div className="page-shell">
          <SectionHeading
            eyebrow="Around the fire"
            title="Currently online"
            description={`${players.length} preview players are exploring the world.`}
            linkTo="/players"
            linkLabel="View all players"
            titleId="players-title"
          />
          <div className="player-preview-grid">
            {onlinePlayers.map((player) => (
              <article
                className="player-preview"
                data-testid="player-preview"
                key={player.username}
              >
                <div
                  className="player-avatar"
                  style={{ backgroundColor: player.color }}
                  aria-hidden="true"
                >
                  {player.initials}
                </div>
                <div>
                  <h3>{player.username}</h3>
                  <p>{player.role}</p>
                </div>
                <span className="player-location">{player.location}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section settlement-section page-shell">
        <div
          className="settlement-visual"
          role="img"
          aria-label={siteContent.settlement.imageAlt}
        >
          <span className="settlement-sun" aria-hidden="true" />
          <span className="settlement-ridge ridge-back" aria-hidden="true" />
          <span className="settlement-ridge ridge-front" aria-hidden="true" />
          <span className="settlement-keep" aria-hidden="true" />
        </div>
        <div className="settlement-copy">
          <p className="eyebrow">Featured settlement</p>
          <h2>{siteContent.settlement.name}</h2>
          <dl className="settlement-facts">
            <div>
              <dt>Coordinates</dt>
              <dd>{siteContent.settlement.coordinates}</dd>
            </div>
            <div>
              <dt>Dimension</dt>
              <dd>{siteContent.settlement.dimension}</dd>
            </div>
          </dl>
          <p>{siteContent.settlement.description}</p>
        </div>
      </section>

      <section
        className="home-section map-section page-shell"
        id="map"
        aria-labelledby="map-title"
      >
        <SectionHeading
          eyebrow="World survey"
          title="Explore the known world"
          description="A static atlas preview reserves this space for the live BlueMap integration arriving in Phase 2."
          linkTo="/map"
          linkLabel="Explore the full world"
          titleId="map-title"
        />
        <div
          className="map-preview"
          role="img"
          aria-label="Stylised placeholder map with rivers, routes, and settlement markers"
        >
          <div className="map-contours" aria-hidden="true" />
          <span className="map-river" aria-hidden="true" />
          <span className="map-road road-north" aria-hidden="true" />
          <span className="map-road road-south" aria-hidden="true" />
          <span className="map-place place-main">Main settlement</span>
          <span className="map-place place-quarry">Old quarry</span>
          <span className="map-place place-harbour">Western harbour</span>
          <span className="map-scale">Preview map / Not live</span>
        </div>
      </section>

      <section
        className="home-section stories-section"
        id="stories"
        aria-labelledby="stories-title"
      >
        <div className="page-shell">
          <SectionHeading
            eyebrow="Field notes"
            title="Latest stories"
            description="Build journals, expedition logs, and the explanations behind questionable decisions."
            linkTo="/stories"
            linkLabel="Read all stories"
            titleId="stories-title"
          />
          <div className="story-preview-list">
            {stories.slice(0, 3).map((story, index) => (
              <article className="story-preview" key={story.slug}>
                <div
                  className="story-artwork"
                  data-tone={story.tone}
                  role="img"
                  aria-label={story.artworkLabel}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="story-copy">
                  <p className="story-meta">
                    By {story.author} /{' '}
                    <time dateTime={story.publishedAt}>{story.dateLabel}</time>
                  </p>
                  <h3>{story.title}</h3>
                  <p>{story.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="home-section events-section page-shell"
        id="events"
        aria-labelledby="events-title"
      >
        <SectionHeading
          eyebrow="On the calendar"
          title="Upcoming events"
          description="Meetups, shared projects, and expeditions worth showing up prepared for."
          linkTo="/events"
          linkLabel="View all events"
          titleId="events-title"
        />
        <div className="event-preview-list">
          {upcomingEvents.map((event) => (
            <article className="event-preview" key={event.slug}>
              <time className="event-date" dateTime={event.startsAt}>
                {event.dateLabel}
              </time>
              <div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
              <p className="event-organiser">
                {event.timeLabel}
                <span>Organised by {event.organiser}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="home-section screenshots-section"
        id="screenshots"
        aria-labelledby="screenshots-title"
      >
        <div className="page-shell">
          <SectionHeading
            eyebrow="From the archive"
            title="Recent screenshots"
            description="Replaceable views from around the server, ready for the managed gallery in Phase 7."
            linkTo="/screenshots"
            linkLabel="Open the gallery"
            titleId="screenshots-title"
          />
          <div className="screenshot-preview-grid">
            {screenshots.slice(0, 4).map((screenshot) => (
              <article className="screenshot-preview" key={screenshot.id}>
                <div
                  className="screenshot-artwork"
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
  linkTo: string
  linkLabel: string
  titleId: string
}

function SectionHeading({
  eyebrow,
  title,
  description,
  linkTo,
  linkLabel,
  titleId,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={titleId}>{title}</h2>
      </div>
      <p>{description}</p>
      <Link className="section-link" to={linkTo}>
        {linkLabel}
        <span aria-hidden="true">-&gt;</span>
      </Link>
    </div>
  )
}
