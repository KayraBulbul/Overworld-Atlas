import { PageMasthead } from '../components/content/PageMasthead'
import { stories } from '../content/siteContent'

export function StoriesPage() {
  return (
    <>
      <PageMasthead
        index="03"
        eyebrow="Field notes"
        title="Stories from the world"
        description="Build journals, travel logs, and records of the moments worth remembering."
        note="These stories are static previews until PostgreSQL-backed publishing arrives."
      />
      <section className="page-shell page-content" aria-label="Story archive">
        <div className="story-archive">
          {stories.map((story, index) => (
            <article className="story-archive-entry" key={story.slug}>
              <div
                className="story-artwork story-artwork-large"
                data-tone={story.tone}
                role="img"
                aria-label={story.artworkLabel}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <p className="story-meta">
                  By {story.author} /{' '}
                  <time dateTime={story.publishedAt}>{story.dateLabel}</time>
                </p>
                <h2>{story.title}</h2>
                <p>{story.excerpt}</p>
                <span className="preview-entry-label">Preview entry</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
