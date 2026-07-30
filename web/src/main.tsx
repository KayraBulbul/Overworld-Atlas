import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { AccessPreviewProvider } from './features/access/AccessPreviewProvider'
import { ThemeProvider } from './features/theme/ThemeProvider'
import './index.css'
import { router } from './routes/router'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AccessPreviewProvider>
          <RouterProvider router={router} />
        </AccessPreviewProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
