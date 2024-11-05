import { useLocation } from 'react-router-dom'

export function useIsLandingPage() {
  const { pathname } = useLocation()
  return pathname.endsWith('/')
}

export function useIsSwapPage() {
  const { pathname } = useLocation()
  return pathname.endsWith('/swap')
}
