import { OptimalRate, TransactionParams, constructSimpleSDK } from '@paraswap/sdk'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ChainId } from '@uniswap/sdk-core'

export type GetRateInput = Parameters<ReturnType<typeof constructSimpleSDK>['swap']['getRate']>[0]
type BuildTxInput = Parameters<ReturnType<typeof constructSimpleSDK>['swap']['buildTx']>[0]

export type ParaswapSupportedChainId =
  | ChainId.MAINNET
  | ChainId.BNB
  | ChainId.ARBITRUM_ONE
  | ChainId.POLYGON
  | ChainId.OPTIMISM
  | ChainId.AVALANCHE
  | ChainId.BASE

export const paraswapFeeAddresses: Record<ParaswapSupportedChainId, string> = {
  [ChainId.MAINNET]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.BNB]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.ARBITRUM_ONE]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.POLYGON]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.OPTIMISM]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.AVALANCHE]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.BASE]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
}

export function isParaswapSupportedChain(chainId?: ChainId): chainId is ParaswapSupportedChainId {
  // @ts-ignore
  return !!paraswapFeeAddresses[chainId]
}

export const PARASWAP_FEE_BPS = 10

// eslint-disable-next-line
export const apiParaswap = createApi({
  reducerPath: 'apiParaswap',
  baseQuery: fetchBaseQuery(),
  endpoints: (build) => ({
    paraswapQuerySwapRoute: build.query<OptimalRate, GetRateInput & { chainId: ChainId }>({
      queryFn: (args) => {
        const { chainId, ...filteredArgs } = args
        const paraSwapMin = constructSimpleSDK({ chainId, fetch: window.fetch, version: '6.2' })
        // https://developers.paraswap.network/api/get-rate-for-a-token-pair
        return paraSwapMin.swap
          .getRate(filteredArgs)
          .then((data) => ({ data }))
          .catch((err) => ({
            error: { status: 'CUSTOM_ERROR', error: err?.detail ?? err?.message ?? err },
          }))
      },
    }),
    paraswapConfirmSwap: build.mutation<TransactionParams, BuildTxInput & { chainId: ChainId }>({
      queryFn: (args) => {
        const { chainId, ...filteredArgs } = args
        if (!isParaswapSupportedChain(chainId)) throw new Error(`Chain ${chainId} is not supported by Paraswap`)
        const FEE_PAY_TO_ADDRESS = paraswapFeeAddresses[chainId]
        const paraSwapMin = constructSimpleSDK({ chainId, fetch: window.fetch, version: '6.2' })
        return paraSwapMin.swap
          .buildTx({
            // https://developers.paraswap.network/api/build-parameters-for-transaction
            partner: 'DeFi-DEX',
            partnerAddress: FEE_PAY_TO_ADDRESS,
            partnerFeeBps: PARASWAP_FEE_BPS, // change it in ParaswapTrade in swapFee to.
            isDirectFeeTransfer: true,
            ...filteredArgs,
          })
          .then((data) => ({ data }))
          .catch((err) => ({
            error: { status: 'CUSTOM_ERROR', error: err?.detail ?? err?.message ?? err },
          }))
      },
    }),
  }),
})

// eslint-disable-next-line
export const { useParaswapQuerySwapRouteQuery, useParaswapConfirmSwapMutation } = apiParaswap
