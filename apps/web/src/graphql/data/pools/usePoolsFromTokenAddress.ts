import { ApolloError } from '@apollo/client'
import { ChainId } from '@uniswap/sdk-core'
import { PoolTableSortState, TablePool, V2_BIPS, calculateTurnover, sortPools } from 'graphql/data/pools/useTopPools'
import { useCallback, useMemo, useRef } from 'react'
import {
  TopV2PairsQuery,
  TopV3PoolsQuery,
} from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'

const DEFAULT_QUERY_SIZE = 20
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function usePoolsFromTokenAddress(tokenAddress: string, sortState: PoolTableSortState, chainId?: ChainId) {
  // FIXME: disabled explorer graphql
  // const {
  //   loading: loadingV3,
  //   error: errorV3,
  //   data: dataV3,
  //   fetchMore: fetchMoreV3,
  // } = useTopV3PoolsQuery({
  //   variables: {
  //     first: DEFAULT_QUERY_SIZE,
  //     tokenAddress,
  //     chain: chainIdToBackendName(chainId),
  //   },
  // })
  const {
    loading: loadingV3,
    error: errorV3,
    data: dataV3,
    fetchMore: fetchMoreV3,
  } = {
    loading: false,
    error: undefined as ApolloError | undefined,
    data: undefined as TopV3PoolsQuery | undefined,
    fetchMore: (() => null) as any,
  }

  // FIXME: disabled explorer graphql
  // const {
  //   loading: loadingV2,
  //   error: errorV2,
  //   data: dataV2,
  //   fetchMore: fetchMoreV2,
  // } = useTopV2PairsQuery({
  //   variables: {
  //     first: DEFAULT_QUERY_SIZE,
  //     tokenAddress,
  //   },
  //   skip: chainId !== ChainId.MAINNET,
  // })
  const {
    loading: loadingV2,
    error: errorV2,
    data: dataV2,
    fetchMore: fetchMoreV2,
  } = {
    loading: false,
    error: undefined as ApolloError | undefined,
    data: undefined as TopV2PairsQuery | undefined,
    fetchMore: (() => null) as any,
  }

  const loading = loadingV3 || loadingV2

  const loadingMoreV3 = useRef(false)
  const loadingMoreV2 = useRef(false)
  const sizeRef = useRef(DEFAULT_QUERY_SIZE)
  const loadMore = useCallback(
    ({ onComplete }: { onComplete?: () => void }) => {
      if (loadingMoreV3.current || (loadingMoreV2.current && chainId === ChainId.MAINNET)) {
        return
      }
      loadingMoreV3.current = true
      loadingMoreV2.current = true
      sizeRef.current += DEFAULT_QUERY_SIZE
      fetchMoreV3({
        variables: {
          cursor: dataV3?.topV3Pools?.[dataV3.topV3Pools.length - 1]?.totalLiquidity?.value,
        },
        // @ts-ignore
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !prev || !Object.keys(prev).length) return prev
          if (!loadingMoreV2.current || chainId !== ChainId.MAINNET) onComplete?.()
          const mergedData = {
            topV3Pools: [...(prev.topV3Pools ?? []).slice(), ...(fetchMoreResult.topV3Pools ?? []).slice()],
          }
          loadingMoreV3.current = false
          return mergedData
        },
      })
      chainId === ChainId.MAINNET &&
        fetchMoreV2({
          variables: {
            cursor: dataV2?.topV2Pairs?.[dataV2.topV2Pairs.length - 1]?.totalLiquidity?.value,
          },
          // @ts-ignore
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult || !prev || !Object.keys(prev).length) return prev
            if (!loadingMoreV3.current) onComplete?.()
            const mergedData = {
              topV2Pairs: [...(prev.topV2Pairs ?? []).slice(), ...(fetchMoreResult.topV2Pairs ?? []).slice()],
            }
            loadingMoreV2.current = false
            return mergedData
          },
        })
    },
    [chainId, dataV2?.topV2Pairs, dataV3?.topV3Pools, fetchMoreV2, fetchMoreV3]
  )

  return useMemo(() => {
    const topV3Pools: TablePool[] =
      dataV3?.topV3Pools?.map((pool) => {
        return {
          hash: pool.address,
          token0: pool.token0,
          token1: pool.token1,
          txCount: pool.txCount,
          tvl: pool.totalLiquidity?.value,
          volume24h: pool.volume24h?.value,
          volumeWeek: pool.volumeWeek?.value,
          turnover: calculateTurnover(pool.volume24h?.value, pool.totalLiquidity?.value, pool.feeTier),
          feeTier: pool.feeTier,
          protocolVersion: pool.protocolVersion,
        } as TablePool
      }) ?? []
    const topV2Pairs: TablePool[] =
      dataV2?.topV2Pairs?.map((pool) => {
        return {
          hash: pool.address,
          token0: pool.token0,
          token1: pool.token1,
          txCount: pool.txCount,
          tvl: pool.totalLiquidity?.value,
          volume24h: pool.volume24h?.value,
          volumeWeek: pool.volumeWeek?.value,
          turnover: calculateTurnover(pool.volume24h?.value, pool.totalLiquidity?.value, V2_BIPS),
          feeTier: V2_BIPS,
          protocolVersion: pool.protocolVersion,
        } as TablePool
      }) ?? []

    const pools = sortPools([...topV3Pools, ...topV2Pairs], sortState).slice(0, sizeRef.current)
    return { loading, errorV2, errorV3, pools, loadMore }
  }, [dataV2?.topV2Pairs, dataV3?.topV3Pools, errorV2, errorV3, loadMore, loading, sortState])
}
