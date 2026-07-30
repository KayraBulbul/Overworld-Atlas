import { tw } from '../styles/tailwindStyles'
import { PageMasthead } from '../components/content/PageMasthead'
import { siteContent } from '../content/siteContent'

export function MapPage() {
  return (
    <>
      <PageMasthead
        index="02"
        eyebrow="World survey"
        title="The full atlas"
        description="A map-first page prepared for the live BlueMap world explorer."
        note="The current BlueMap endpoint is HTTP-only, so Phase 1 does not embed it."
      />
      <section
        className={tw('map-page page-shell')}
        aria-labelledby="map-preview-title"
      >
        <div className={tw('map-page-toolbar')}>
          <div>
            <p className={tw('eyebrow')}>Static survey</p>
            <h2 id="map-preview-title">Known landmarks</h2>
          </div>
          <p>
            Secure integration pending
            <span>{siteContent.server.blueMapUrl}</span>
          </p>
        </div>
        <div
          className={tw('map-preview map-preview-full')}
          role="img"
          aria-label="Full-page stylised placeholder map with settlement markers and survey routes"
        >
          <div className={tw('map-contours')} aria-hidden="true" />
          <span className={tw('map-river')} aria-hidden="true" />
          <span className={tw('map-road road-north')} aria-hidden="true" />
          <span className={tw('map-road road-south')} aria-hidden="true" />
          <span className={tw('map-place place-main')}>Main settlement</span>
          <span className={tw('map-place place-quarry')}>Old quarry</span>
          <span className={tw('map-place place-harbour')}>Western harbour</span>
          <span className={tw('map-place place-north')}>North ridge</span>
          <span className={tw('map-scale')}>Preview map / Not live</span>
        </div>
      </section>
    </>
  )
}
