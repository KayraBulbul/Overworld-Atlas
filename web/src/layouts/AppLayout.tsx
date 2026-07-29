import { Link, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <>
      <header>
        <nav aria-label="Main navigation">
          <Link to="/">Goon Squad SMP</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
