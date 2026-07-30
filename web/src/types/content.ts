export type PlayerPreview = {
  username: string
  initials: string
  role: string
  location: string
  color: string
  stats: {
    playtime: string
    deaths: number
    distance: string
  }
}

export type StoryPreview = {
  slug: string
  title: string
  excerpt: string
  author: string
  publishedAt: string
  dateLabel: string
  artworkLabel: string
  tone: 'river' | 'forest' | 'ember' | 'stone'
}

export type EventPreview = {
  slug: string
  title: string
  description: string
  organiser: string
  startsAt: string
  dateLabel: string
  timeLabel: string
  period: 'upcoming' | 'past'
}

export type ScreenshotPreview = {
  id: string
  title: string
  contributor: string
  capturedAt: string
  dateLabel: string
  alt: string
  tone: 'dawn' | 'cavern' | 'harbour' | 'nether' | 'snow' | 'village'
}
