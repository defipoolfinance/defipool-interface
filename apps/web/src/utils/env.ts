export function isDevelopmentEnv(): boolean {
  return process.env.NODE_ENV === 'development'
}

export function isTestEnv(): boolean {
  return process.env.NODE_ENV === 'test'
}

export function isStagingEnv(): boolean {
  // This is set in vercel builds and deploys from web/staging.
  return Boolean(process.env.REACT_APP_STAGING)
}

export function isProductionEnv(): boolean {
  return process.env.NODE_ENV === 'production' && !isStagingEnv()
}

export function isAppDexOrg({ hostname }: { hostname: string }): boolean {
  return hostname === 'new.defipool.finance'
}

export function isAppDexStagingOrg({ hostname }: { hostname: string }): boolean {
  return hostname === 'dex.itproject.dev'
}

export function isBrowserRouterEnabled(): boolean {
  console.log('window.location', window.location)
  if (isProductionEnv()) {
    if (
      isAppDexOrg(window.location) ||
      isAppDexStagingOrg(window.location) ||
      isLocalhost(window.location) // cypress tests
    ) {
      return true
    }
    return false // production builds *not* served through our domains or localhost, eg IPFS
  }
  return true // local dev builds
}

function isLocalhost({ hostname }: { hostname: string }): boolean {
  return hostname === 'localhost'
}

export function isSentryEnabled(): boolean {
  // Disable in e2e test environments
  if (isStagingEnv() && !isAppDexStagingOrg(window.location)) return false
  if (isProductionEnv() && !isAppDexOrg(window.location)) return false
  return process.env.REACT_APP_SENTRY_ENABLED === 'true'
}

// eslint-disable-next-line
export function getEnvName(): 'production' | 'staging' | 'development' {
  if (isStagingEnv()) {
    return 'staging'
  }
  if (isProductionEnv()) {
    return 'production'
  }
  return 'development'
}
