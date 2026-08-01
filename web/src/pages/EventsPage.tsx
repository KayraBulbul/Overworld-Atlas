import { tw } from '../styles/tailwindStyles'
import { PageMasthead } from '../components/content/PageMasthead'
import { events } from '../content/siteContent'
import type { EventPreview } from '../types/content'

export function EventsPage() {
  const upcomingEvents = events.filter((event) => event.period === 'upcoming')
  const pastEvents = events.filter((event) => event.period === 'past')

  return (
    <>
      <PageMasthead
        index="04"
        eyebrow="Community calendar"
        title="Plans worth logging in for"
        description="Upcoming expeditions and project nights, followed by a record of recent gatherings."
        note="Dates and organisers are static Phase 1 preview content."
      />
      <div className={tw('page-shell page-content events-archive')}>
        <EventGroup title="Upcoming events" events={upcomingEvents} />
        <EventGroup title="Past events" events={pastEvents} />
      </div>
    </>
  )
}

function EventGroup({
  title,
  events,
}: {
  title: string
  events: EventPreview[]
}) {
  return (
    <section
      className={tw('event-group')}
      aria-labelledby={title.replace(' ', '-')}
    >
      <div className={tw('event-group-title')}>
        <h2 id={title.replace(' ', '-')}>{title}</h2>
        <span>{events.length.toString().padStart(2, '0')}</span>
      </div>
      <div className={tw('event-archive-list')}>
        {events.map((event) => (
          <article className={tw('event-archive-entry')} key={event.slug}>
            <time dateTime={event.startsAt}>
              <strong>{event.dateLabel}</strong>
              <span>{event.timeLabel}</span>
            </time>
            <div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
            <p>
              Organised by <strong>{event.organiser}</strong>
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
