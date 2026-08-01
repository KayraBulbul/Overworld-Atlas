import { tw } from '../styles/tailwindStyles'
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
      <section
        className={tw('page-shell page-content')}
        aria-label="Story archive"
      >
        <div className={tw('story-archive')}>
          {stories.map((story, index) => (
            <article className={tw('story-archive-entry')} key={story.slug}>
              <div
                className={tw('story-artwork story-artwork-large')}
                data-tone={story.tone}
                role="img"
                aria-label={story.artworkLabel}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <p className={tw('story-meta')}>
                  By {story.author} /{' '}
                  <time dateTime={story.publishedAt}>{story.dateLabel}</time>
                </p>
                <h2>{story.title}</h2>
                <p>{story.excerpt}</p>
                <span className={tw('preview-entry-label')}>Preview entry</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
