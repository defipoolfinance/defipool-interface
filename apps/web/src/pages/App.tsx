import { CustomUserProperties, getBrowser, SharedEventName } from '@uniswap/analytics-events'
// import { useWeb3React } from '@web3-react/core'
import { sendAnalyticsEvent, sendInitializationEvent, Trace, user } from 'analytics'
import ErrorBoundary from 'components/ErrorBoundary'
import Loader from 'components/Icons/LoadingSpinner'
import NavBar, { PageTabs } from 'components/NavBar'
import { UK_BANNER_HEIGHT, UK_BANNER_HEIGHT_MD, UK_BANNER_HEIGHT_SM } from 'components/NavBar/UkBanner'
import { useFeatureFlagURLOverrides } from 'featureFlags'
import { useAtom } from 'jotai'
import { useBag } from 'nft/hooks/useBag'
import { lazy, memo, Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async/lib/index'
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import { shouldDisableNFTRoutesAtom } from 'state/application/atoms'
import { useAppSelector } from 'state/hooks'
// import { AppState } from 'state/reducer'
import { useRouterPreference } from 'state/user/hooks'
// import { StatsigUser } from 'statsig-react'
import styled from 'styled-components'
import DarkModeQueryParamReader from 'theme/components/DarkModeQueryParamReader'
import { useIsDarkMode } from 'theme/components/ThemeToggle'
import { flexRowNoWrap } from 'theme/styles'
import { Z_INDEX } from 'theme/zIndex'
import { isPathBlocked } from 'utils/blockedPaths'
import { MICROSITE_LINK } from 'utils/openDownloadApp'
import { getCurrentPageFromLocation } from 'utils/urlRoutes'
import { getCLS, getFCP, getFID, getLCP, Metric } from 'web-vitals'

import { findRouteByPath, RouteDefinition, routes, useRouterConfig } from './RouteDefinitions'

const AppChrome = lazy(() => import('./AppChrome'))

const BodyWrapper = styled.div<{ bannerIsVisible?: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  min-height: calc(100vh - ${({ bannerIsVisible }) => (bannerIsVisible ? UK_BANNER_HEIGHT : 0)}px);
  padding: ${({ theme }) => theme.navHeight}px 0 5rem 0;
  align-items: center;
  flex: 1;
  background-color: #14151d;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    min-height: calc(100vh - ${({ bannerIsVisible }) => (bannerIsVisible ? UK_BANNER_HEIGHT_MD : 0)}px);
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    min-height: calc(100vh - ${({ bannerIsVisible }) => (bannerIsVisible ? UK_BANNER_HEIGHT_SM : 0)}px);
  }
`

const MobileBottomBar = styled.div`
  z-index: ${Z_INDEX.sticky};
  position: fixed;
  display: flex;
  bottom: 0;
  right: 0;
  left: 0;
  width: calc(100vw - 16px);
  justify-content: space-between;
  padding: 0 4px;
  height: ${({ theme }) => theme.mobileBottomBarHeight}px;
  background: ${({ theme }) => theme.surface1};
  border: 1px solid ${({ theme }) => theme.surface3};
  margin: 8px;
  border-radius: 20px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoint.md}px) {
    display: none;
  }
`

const HeaderWrapper = styled.div<{ transparent?: boolean; bannerIsVisible?: boolean; scrollY: number }>`
  ${flexRowNoWrap};
  background-color: ${({ theme, transparent }) => !transparent && theme.surface1};
  border-bottom: ${({ theme, transparent }) => !transparent && `1px solid ${theme.surface3}`};
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: ${({ bannerIsVisible }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT - scrollY, 0) : 0)}px;
  z-index: ${Z_INDEX.sticky};

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    top: ${({ bannerIsVisible }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT_MD - scrollY, 0) : 0)}px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    top: ${({ bannerIsVisible }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT_SM - scrollY, 0) : 0)}px;
  }
`

// const useRenderUkBanner = () => {
//   const originCountry = useAppSelector((state: AppState) => state.user.originCountry)
//   return Boolean(originCountry) && originCountry === 'GB'
// }

export default function App() {
  const [, setShouldDisableNFTRoutes] = useAtom(shouldDisableNFTRoutesAtom)

  const location = useLocation()
  const { pathname } = location
  const currentPage = getCurrentPageFromLocation(pathname)
  // const renderUkBanner = useRenderUkBanner()

  const [searchParams] = useSearchParams()
  useEffect(() => {
    if (searchParams.get('disableNFTs') === 'true') {
      setShouldDisableNFTRoutes(true)
    } else if (searchParams.get('disableNFTs') === 'false') {
      setShouldDisableNFTRoutes(false)
    }
  }, [searchParams, setShouldDisableNFTRoutes])

  useFeatureFlagURLOverrides()

  // const { account } = useWeb3React()
  // const statsigUser: StatsigUser = useMemo(
  //   () => ({
  //     userID: getDeviceId(),
  //     customIDs: { address: account ?? '' },
  //   }),
  //   [account]
  // )

  // redirect address to landing pages until implemented
  const shouldRedirectToAppInstall = pathname?.startsWith('/address/')
  useLayoutEffect(() => {
    if (shouldRedirectToAppInstall) {
      window.location.href = MICROSITE_LINK
    }
  }, [shouldRedirectToAppInstall])
  const [isDropdownSelectorMenuContainer, setIsDropdownSelectorMenuContainer] = useState(false)

  useEffect(() => {
    // wait event from GA
    window.addEventListener('chain_selector_open', () => {
      setIsDropdownSelectorMenuContainer(true)
    })
    window.addEventListener('chain_selector_close', () => {
      setIsDropdownSelectorMenuContainer(false)
    })

    return () => {
      window.removeEventListener('chain_selector_open', () => {
        setIsDropdownSelectorMenuContainer(true)
      })
      window.removeEventListener('chain_selector_close', () => {
        setIsDropdownSelectorMenuContainer(false)
      })
    }
  }, [])

  if (shouldRedirectToAppInstall) {
    return null
  }

  const shouldBlockPath = isPathBlocked(pathname)
  if (shouldBlockPath && pathname !== '/swap') {
    return <Navigate to="/swap" replace />
  }

  return (
    <ErrorBoundary>
      <DarkModeQueryParamReader />
      <Trace page={currentPage}>
        {/*
          This is where *static* page titles are injected into the <head> tag. If you
          want to set a page title based on data that's dynamic or not available on first render,
          you can set it later in the page component itself, since react-helmet-async prefers the most recently rendered title.
        */}
        <Helmet>
          <title>{findRouteByPath(pathname)?.getTitle(pathname) ?? 'DeFi Pool'}</title>
        </Helmet>
        <UserPropertyUpdater />
        {/*{renderUkBanner && <UkBanner />}*/}
        <Header />
        <ResetPageScrollEffect />
        <Body />
        {!isDropdownSelectorMenuContainer ? (
          <MobileBottomBar>
            <PageTabs />
          </MobileBottomBar>
        ) : null}

        {/* </StatsigProvider> */}
      </Trace>
    </ErrorBoundary>
  )
}

const Body = memo(function Body() {
  const routerConfig = useRouterConfig()
  // const renderUkBanner = useRenderUkBanner()
  const renderUkBanner = false

  return (
    <BodyWrapper bannerIsVisible={renderUkBanner}>
      <Suspense>
        <AppChrome />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <Routes>
          {routes.map((route: RouteDefinition) =>
            route.enabled(routerConfig) ? (
              <Route key={route.path} path={route.path} element={route.getElement(routerConfig)}>
                {route.nestedPaths.map((nestedPath) => (
                  <Route
                    path={nestedPath}
                    element={route.getElement(routerConfig)}
                    key={`${route.path}/${nestedPath}`}
                  />
                ))}
              </Route>
            ) : null
          )}
        </Routes>
      </Suspense>
    </BodyWrapper>
  )
})

const ResetPageScrollEffect = memo(function ResetPageScrollEffect() {
  const location = useLocation()
  const { pathname } = location
  const currentPage = getCurrentPageFromLocation(pathname)
  const [hasChangedOnce, setHasChangedOnce] = useState(false)

  useEffect(() => {
    if (!hasChangedOnce) {
      // avoid setting scroll to top on initial load
      setHasChangedOnce(true)
    } else {
      // URL may change without page changing (e.g. when switching chains), and we only want to reset scroll to top if the page changes
      window.scrollTo(0, 0)
    }
    // we don't want this to re-run on change of hasChangedOnce! or else it defeats the point of the fix
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  return null
})

const Header = memo(function Header() {
  const [isScrolledDown, setIsScrolledDown] = useState(false)
  const isBagExpanded = useBag((state) => state.bagExpanded)
  const isHeaderTransparent = !isScrolledDown && !isBagExpanded
  // const renderUkBanner = useRenderUkBanner()
  const renderUkBanner = false

  useEffect(() => {
    const scrollListener = () => {
      setIsScrolledDown(window.scrollY > 0)
    }
    window.addEventListener('scroll', scrollListener)
    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  return (
    <HeaderWrapper transparent={isHeaderTransparent} bannerIsVisible={renderUkBanner} scrollY={scrollY}>
      <NavBar blur={isHeaderTransparent} />
    </HeaderWrapper>
  )
})

function UserPropertyUpdater() {
  const isDarkMode = useIsDarkMode()

  const [routerPreference] = useRouterPreference()
  const rehydrated = useAppSelector((state) => state._persist.rehydrated)

  useEffect(() => {
    // User properties *must* be set before sending corresponding event properties,
    // so that the event contains the correct and up-to-date user properties.
    user.set(CustomUserProperties.USER_AGENT, navigator.userAgent)
    user.set(CustomUserProperties.BROWSER, getBrowser())
    user.set(CustomUserProperties.SCREEN_RESOLUTION_HEIGHT, window.screen.height)
    user.set(CustomUserProperties.SCREEN_RESOLUTION_WIDTH, window.screen.width)
    user.set(CustomUserProperties.GIT_COMMIT_HASH, process.env.REACT_APP_GIT_COMMIT_HASH ?? 'unknown')

    // Service Worker analytics
    const isServiceWorkerInstalled = Boolean(window.navigator.serviceWorker?.controller)
    const isServiceWorkerHit = Boolean((window as any).__isDocumentCached)
    const serviceWorkerProperty = isServiceWorkerInstalled ? (isServiceWorkerHit ? 'hit' : 'miss') : 'uninstalled'

    const pageLoadProperties = { service_worker: serviceWorkerProperty }
    sendInitializationEvent(SharedEventName.APP_LOADED, pageLoadProperties)
    const sendWebVital =
      (metric: string) =>
      ({ delta }: Metric) =>
        sendAnalyticsEvent(SharedEventName.WEB_VITALS, { ...pageLoadProperties, [metric]: delta })
    getCLS(sendWebVital('cumulative_layout_shift'))
    getFCP(sendWebVital('first_contentful_paint_ms'))
    getFID(sendWebVital('first_input_delay_ms'))
    getLCP(sendWebVital('largest_contentful_paint_ms'))
  }, [])

  useEffect(() => {
    user.set(CustomUserProperties.DARK_MODE, isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    if (!rehydrated) return
    user.set(CustomUserProperties.ROUTER_PREFERENCE, routerPreference)
  }, [routerPreference, rehydrated])
  return null
}
