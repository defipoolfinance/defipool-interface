/* eslint-disable prettier/prettier */
// Ordering is intentional and must be preserved: styling, polyfilling, tracing, and then functionality.
import '@reach/dialog/styles.css'
import 'inter-ui'
import 'polyfills'
import 'tracing'
import 'connection/eagerlyConnect'
/* eslint-enable prettier/prettier */

import { Provider as ApolloProvider } from 'graphql/data/apollo/Provider'
import { BlockNumberProvider } from 'lib/hooks/useBlockNumber'
import { MulticallUpdater } from 'lib/state/multicall'
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Helmet, HelmetProvider } from 'react-helmet-async/lib/index'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter, useLocation } from 'react-router-dom'
import { SystemThemeUpdater, ThemeColorMetaUpdater } from 'theme/components/ThemeToggle'
import { TamaguiProvider } from 'theme/tamaguiProvider'
import { UnitagUpdaterContextProvider } from 'uniswap/src/features/unitags/context'
import { isBrowserRouterEnabled } from 'utils/env'
import { getCanonicalUrl } from 'utils/urlRoutes'
import { LoadingBubble } from './components/Tokens/loading'
import Web3Provider from './components/Web3Provider'
import { LanguageProvider } from './i18n'
import App from './pages/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import LogsUpdater from './state/logs/updater'
import OrderUpdater from './state/signatures/updater'
import TransactionUpdater from './state/transactions/updater'
import { ThemeProvider, ThemedGlobalStyle } from './theme'
import RadialGradientByChainUpdater from './theme/components/RadialGradientByChainUpdater'

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
  const location = useLocation()

  return (
    <>
      <Helmet>
        <link rel="canonical" href={getCanonicalUrl(location.pathname)} />
      </Helmet>
      <RadialGradientByChainUpdater />
      <ListsUpdater />
      <SystemThemeUpdater />
      <ThemeColorMetaUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <OrderUpdater />
      <MulticallUpdater />
      <LogsUpdater />
    </>
  )
}

const queryClient = new QueryClient()

const container = document.getElementById('root') as HTMLElement

const Router = isBrowserRouterEnabled() ? BrowserRouter : HashRouter // production builds *not* served through our domains or localhost, eg IPFS

const AppWrapper = () => {
  const [appLoaded, setAppLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppLoaded(true)
    }
  }, [])

  return appLoaded ? (
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <LanguageProvider>
              <Web3Provider>
                <ApolloProvider>
                  <BlockNumberProvider>
                    <UnitagUpdaterContextProvider>
                      <Updaters />
                      <ThemeProvider>
                        <TamaguiProvider>
                          <ThemedGlobalStyle />
                          <App />
                        </TamaguiProvider>
                      </ThemeProvider>
                    </UnitagUpdaterContextProvider>
                  </BlockNumberProvider>
                </ApolloProvider>
              </Web3Provider>
            </LanguageProvider>
          </Router>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  ) : (
    <LoadingBubble />
  )
}
createRoot(container).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
)

if (process.env.REACT_APP_SERVICE_WORKER === 'enable') {
  serviceWorkerRegistration.register()
}
