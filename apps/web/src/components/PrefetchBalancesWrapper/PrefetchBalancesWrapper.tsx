import { useWeb3React } from '@web3-react/core'
import usePrevious from 'hooks/usePrevious'
import { atom, useAtom } from 'jotai'
import ms from 'ms'
import { PropsWithChildren, useCallback, useEffect } from 'react'
import { usePortfolioBalancesWebQuery } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'

import { usePendingActivity } from '../AccountDrawer/MiniPortfolio/Activity/hooks'

/** Returns true if the number of pending activities has decreased */
function useHasUpdatedTx() {
  const { pendingActivityCount } = usePendingActivity()
  const prevPendingActivityCount = usePrevious(pendingActivityCount)

  return !!prevPendingActivityCount && pendingActivityCount < prevPendingActivityCount
}

// TODO(WEB-3004) - Add useCachedPortfolioBalanceUsd to simplify usage of useCachedPortfolioBalancesQuery
// eslint-disable-next-line
export function useCachedPortfolioBalancesQuery({ account }: { account?: string }) {
  // const v = usePortfolioBalancesWebQuery({
  //   skip: !account,
  //   variables: { ownerAddress: account ?? '', chains: GQL_MAINNET_CHAINS_MUTABLE },
  //   fetchPolicy: 'cache-only', // PrefetchBalancesWrapper handles balance fetching/staleness; this component only reads from cache
  //   errorPolicy: 'all',
  // })

  // FIXME: disabled because of graphql query
  const ret: Partial<ReturnType<typeof usePortfolioBalancesWebQuery>> = {
    loading: false,
    data: undefined,
  }

  return ret
}

const hasUnfetchedBalancesAtom = atom<boolean>(true)

/* Prefetches & caches portfolio balances when the wrapped component is hovered or the user completes a transaction */
export default function PrefetchBalancesWrapper({
  children,
  shouldFetchOnAccountUpdate,
  shouldFetchOnHover = true,
  className,
}: PropsWithChildren<{ shouldFetchOnAccountUpdate: boolean; shouldFetchOnHover?: boolean; className?: string }>) {
  const { account } = useWeb3React()
  // FIXME: disabled because of graphql query
  // const [prefetchPortfolioBalances] = usePortfolioBalancesWebLazyQuery()

  // Use an atom to track unfetched state to avoid duplicating fetches if this component appears multiple times on the page.
  const [hasUnfetchedBalances, setHasUnfetchedBalances] = useAtom(hasUnfetchedBalancesAtom)
  const fetchBalances = useCallback(
    (withDelay: boolean) => {
      if (account) {
        // Backend takes <2sec to get the updated portfolio value after a transaction
        // This timeout is an interim solution while we're working on a websocket that'll ping the client when connected account gets changes
        // TODO(WEB-3131): remove this timeout after websocket is implemented
        setTimeout(
          () => {
            // prefetchPortfolioBalances({ variables: { ownerAddress: account, chains: GQL_MAINNET_CHAINS_MUTABLE } })
            setHasUnfetchedBalances(false)
          },
          withDelay ? ms('3.5s') : 0
        )
      }
    },
    // [account, prefetchPortfolioBalances, setHasUnfetchedBalances]
    [account, setHasUnfetchedBalances]
  )

  const prevAccount = usePrevious(account)

  const hasUpdatedTx = useHasUpdatedTx()
  // Listens for account changes & recently updated transactions to keep portfolio balances fresh in apollo cache
  useEffect(() => {
    const accountChanged = prevAccount !== undefined && prevAccount !== account
    if (hasUpdatedTx || accountChanged) {
      // The parent configures whether these conditions should trigger an immediate fetch,
      // if not, we set a flag to fetch on next hover.
      if (shouldFetchOnAccountUpdate) {
        fetchBalances(true)
      } else {
        setHasUnfetchedBalances(true)
      }
    }
  }, [account, prevAccount, shouldFetchOnAccountUpdate, fetchBalances, hasUpdatedTx, setHasUnfetchedBalances])

  // Temporary workaround to fix balances on TDP - this fetches balances if shouldFetchOnAccountUpdate becomes true while hasUnfetchedBalances is true
  // TODO(WEB-3071) remove this logic once balance provider refactor is done
  useEffect(() => {
    if (hasUnfetchedBalances && shouldFetchOnAccountUpdate) fetchBalances(true)
  }, [fetchBalances, hasUnfetchedBalances, shouldFetchOnAccountUpdate])

  const onHover = useCallback(() => {
    if (hasUnfetchedBalances) fetchBalances(false)
  }, [fetchBalances, hasUnfetchedBalances])

  return (
    <div onMouseEnter={shouldFetchOnHover ? onHover : undefined} className={className}>
      {children}
    </div>
  )
}
