import {
  TraceEvent as AnalyticsEvent,
  Trace as AnalyticsTrace,
  sendAnalyticsEvent as sendAnalyticsTraceEvent,
} from '@uniswap/analytics'
import { atomWithStorage, useAtomValue } from 'jotai/utils'
import { memo } from 'react'

// eslint-disable-next-line import/no-unused-modules
export {
  OriginApplication,
  getDeviceId,
  initializeAnalytics,
  useTrace,
  user,
  type ITraceContext,
} from '@uniswap/analytics'

const allowAnalyticsAtomKey = 'allow_analytics'
export const allowAnalyticsAtom = atomWithStorage<boolean>(allowAnalyticsAtomKey, false)

export const Trace = memo((props: React.ComponentProps<typeof AnalyticsTrace>) => {
  const allowAnalytics = useAtomValue(allowAnalyticsAtom)
  const shouldLogImpression = allowAnalytics ? props.shouldLogImpression : false

  return <AnalyticsTrace {...props} shouldLogImpression={shouldLogImpression} />
})

Trace.displayName = 'Trace'

export const TraceEvent = memo((props: React.ComponentProps<typeof AnalyticsEvent>) => {
  const allowAnalytics = useAtomValue(allowAnalyticsAtom)
  const shouldLogImpression = allowAnalytics ? props.shouldLogImpression : false

  return <AnalyticsEvent {...props} shouldLogImpression={shouldLogImpression} />
})

TraceEvent.displayName = 'TraceEvent'

/**
 * @deprecated analytics
 */
export const sendAnalyticsEvent: typeof sendAnalyticsTraceEvent = () => {
  let allowAnalytics = true

  try {
    const value = localStorage.getItem(allowAnalyticsAtomKey)

    if (typeof value === 'string') {
      allowAnalytics = JSON.parse(value)
    }
    // eslint-disable-next-line no-empty
  } catch {}

  if (allowAnalytics) {
    // sendAnalyticsTraceEvent(event, properties)
    // console.log('analytics::', event, properties)
  }
}

// This is only used for initial page load so we can get the user's country
/**
 * @deprecated analytics
 */
export const sendInitializationEvent: typeof sendAnalyticsTraceEvent = () => {
  // console.log('analytics::', event, properties)
  // sendAnalyticsTraceEvent(event, properties)
}
