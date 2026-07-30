import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { EventsPage } from '../pages/EventsPage'
import { HomePage } from '../pages/HomePage'
import { MapPage } from '../pages/MapPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PlayersPage } from '../pages/PlayersPage'
import { ScreenshotsPage } from '../pages/ScreenshotsPage'
import { StoriesPage } from '../pages/StoriesPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'players', element: <PlayersPage /> },
      { path: 'stories', element: <StoriesPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'screenshots', element: <ScreenshotsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
