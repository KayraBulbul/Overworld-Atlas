import type {
  EventPreview,
  ScreenshotPreview,
  StoryPreview,
} from '../types/content'

export const siteContent = {
  server: {
    name: 'Overworld Atlas',
    address: '51.161.199.235:25584',
    description:
      'A long-running private Fabric survival world built around ambitious projects, shared history, and plans that rarely survive first contact.',
    blueMapUrl: 'http://51.161.199.235:25674/',
  },
  settlement: {
    name: 'Overworld Atlas Mountain',
    coordinates: '-1129, 119, 1030',
    dimension: 'Overworld',
    description: 'The promised land',
    imageSrc: '/images/settlements/featured_settlement.webp',
    imageAlt:
      "A path through Overworld Atlas Mountain, with Ethan's hole beside the route and the greenhouse and trading hall visible in the background.",
  },
} as const

export const stories: StoryPreview[] = [
  {
    slug: 'bridge-beneath-the-fog',
    title: 'The Bridge Beneath the Fog',
    excerpt:
      'Three rebuilds, two missing shulker boxes, and the long road to connecting the western farms.',
    author: 'StoneLark',
    publishedAt: '2026-07-24',
    dateLabel: '24 July 2026',
    artworkLabel: 'A stone bridge crossing a mist-covered river',
    tone: 'river',
  },
  {
    slug: 'north-road-name',
    title: 'How the North Road Got Its Name',
    excerpt:
      'An expedition log from the first route beyond the spruce line and the landmarks found along it.',
    author: 'MossByte',
    publishedAt: '2026-07-12',
    dateLabel: '12 July 2026',
    artworkLabel: 'A narrow road winding into a dark spruce forest',
    tone: 'forest',
  },
  {
    slug: 'expensive-chicken',
    title: 'A Very Expensive Chicken',
    excerpt:
      'The entirely avoidable chain of events behind the server railway having one more station than planned.',
    author: 'CopperWren',
    publishedAt: '2026-06-29',
    dateLabel: '29 June 2026',
    artworkLabel: 'A minecart stopped beside a lantern-lit station',
    tone: 'ember',
  },
  {
    slug: 'walls-of-the-east-gate',
    title: 'The Walls of the East Gate',
    excerpt:
      'A build journal covering the palette tests and compromises behind the settlement entrance.',
    author: 'AshenFox',
    publishedAt: '2026-06-08',
    dateLabel: '8 June 2026',
    artworkLabel: 'Tall stone walls surrounding an eastern gate',
    tone: 'stone',
  },
]

export const events: EventPreview[] = [
  {
    slug: 'end-city-expedition',
    title: 'End City Expedition',
    description:
      'Restock rockets, bring spare gear, and meet at the stronghold portal ten minutes early.',
    organiser: 'MossByte',
    startsAt: '2026-08-08T19:00:00+10:00',
    dateLabel: '8 Aug',
    timeLabel: '7:00 PM AEST',
    period: 'upcoming',
  },
  {
    slug: 'harbour-build-night',
    title: 'Harbour Build Night',
    description:
      'A shared build session focused on the western docks, warehouse roofs, and shoreline detailing.',
    organiser: 'StoneLark',
    startsAt: '2026-08-22T18:30:00+10:00',
    dateLabel: '22 Aug',
    timeLabel: '6:30 PM AEST',
    period: 'upcoming',
  },
  {
    slug: 'nether-hub-cleanup',
    title: 'Nether Hub Cleanup',
    description:
      'Signage, spawn-proofing, and one final attempt to make the blue tunnel point north.',
    organiser: 'CopperWren',
    startsAt: '2026-06-20T17:00:00+10:00',
    dateLabel: '20 Jun',
    timeLabel: '5:00 PM AEST',
    period: 'past',
  },
  {
    slug: 'world-tour',
    title: 'Midyear World Tour',
    description:
      'A guided circuit of recent builds, abandoned experiments, and places worth revisiting.',
    organiser: 'AshenFox',
    startsAt: '2026-05-30T19:30:00+10:00',
    dateLabel: '30 May',
    timeLabel: '7:30 PM AEST',
    period: 'past',
  },
]

export const screenshots: ScreenshotPreview[] = [
  {
    id: 'first-light',
    title: 'First light over the ridge',
    contributor: 'StoneLark',
    capturedAt: '2026-07-26',
    dateLabel: '26 July 2026',
    alt: 'Placeholder view of sunrise breaking over a blocky mountain ridge',
    tone: 'dawn',
  },
  {
    id: 'deep-line',
    title: 'The deep slate line',
    contributor: 'QuarryKid',
    capturedAt: '2026-07-18',
    dateLabel: '18 July 2026',
    alt: 'Placeholder view of a lantern-lit tunnel through deep slate',
    tone: 'cavern',
  },
  {
    id: 'western-harbour',
    title: 'Western harbour study',
    contributor: 'AshenFox',
    capturedAt: '2026-07-10',
    dateLabel: '10 July 2026',
    alt: 'Placeholder view of timber docks and boats at the western harbour',
    tone: 'harbour',
  },
  {
    id: 'nether-crossing',
    title: 'Nether crossing',
    contributor: 'CopperWren',
    capturedAt: '2026-06-27',
    dateLabel: '27 June 2026',
    alt: 'Placeholder view of a long bridge crossing a glowing Nether cavern',
    tone: 'nether',
  },
  {
    id: 'snow-road',
    title: 'Road beyond the snow line',
    contributor: 'MossByte',
    capturedAt: '2026-06-16',
    dateLabel: '16 June 2026',
    alt: 'Placeholder view of a road cutting through a snowy forest',
    tone: 'snow',
  },
  {
    id: 'market-evening',
    title: 'Market at evening',
    contributor: 'LanternLad',
    capturedAt: '2026-06-04',
    dateLabel: '4 June 2026',
    alt: 'Placeholder view of a village market lit by hanging lanterns',
    tone: 'village',
  },
]
