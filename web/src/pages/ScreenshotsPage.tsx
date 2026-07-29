import { PageMasthead } from '../components/content/PageMasthead'
import { screenshots } from '../content/siteContent'

export function ScreenshotsPage() {
  return (
    <>
      <PageMasthead
        index="05"
        eyebrow="Visual archive"
        title="Screenshots from the world"
        description="A full static gallery of builds, journeys, and ordinary evenings around the server."
        note="Uploaded images, ownership, and moderation replace these fixtures in Phase 7."
      />
      <section
        className="page-shell page-content"
        aria-label="Screenshot gallery"
      >
        <div className="screenshot-gallery">
          {screenshots.map((screenshot, index) => (
            <article
              className="screenshot-gallery-entry"
              data-featured={index === 0 || index === 3}
              data-testid="screenshot-entry"
              key={screenshot.id}
            >
              <div
                className="screenshot-artwork screenshot-artwork-large"
                data-tone={screenshot.tone}
                role="img"
                aria-label={screenshot.alt}
              />
              <div>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h2>{screenshot.title}</h2>
                <p>
                  Captured by {screenshot.contributor} /{' '}
                  <time dateTime={screenshot.capturedAt}>
                    {screenshot.dateLabel}
                  </time>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
