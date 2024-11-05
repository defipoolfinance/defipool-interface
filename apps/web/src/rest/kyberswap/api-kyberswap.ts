import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { TGetSwapHeaders, TGetSwapRequestParams, TGetSwapResponse } from './kyberswap/types-kyberswap'
import { ChainId } from '@uniswap/sdk-core'
import {
  KyberswapSupportedChainId,
  TGetEncodedDataRequestParams,
  TGetEncodedDataResponse,
  TGetSwapHeaders,
  TGetSwapRequestParams,
  TGetSwapResponse,
} from './types-kyberswap'

const chainNames: Record<KyberswapSupportedChainId, string> = {
  [ChainId.MAINNET]: 'ethereum', // MAINNET
  [ChainId.BNB]: `bsc`, // BSC
  [ChainId.ARBITRUM_ONE]: `arbitrum`, // ARBITRUM
  [ChainId.POLYGON]: `polygon`, // MATIC
  [ChainId.OPTIMISM]: `optimism`, // OPTIMISM
  [ChainId.AVALANCHE]: `avalanche`, // AVAX
  [ChainId.BASE]: `base`, // BASE
  // [ChainId.]: `cronos`, // CRONOS
  // [ChainId.]: `zksync`, // ZKSYNC
  // [ChainId.]: `fantom`, // FANTOM
  // [ChainId.]: `linea`, // LINEA
  // [ChainId.]: `polygon-zkevm`, // POLYGONZKEVM
  // [ChainId.]: `aurora`, // AURORA
  // [ChainId.]: `bittorrent`, // BTTC
  // [ChainId.]: `scroll`, // SCROLL
}

const kyberswapFeeAddresses: Record<KyberswapSupportedChainId, string> = {
  [ChainId.MAINNET]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.BNB]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.ARBITRUM_ONE]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.POLYGON]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.OPTIMISM]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.AVALANCHE]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
  [ChainId.BASE]: '0x6899a795a9F86c294F291CaaB779509EB99f1702',
}

export function isKyberswapSupportedChain(chainId?: ChainId): chainId is KyberswapSupportedChainId {
  // @ts-ignore
  return !!kyberswapFeeAddresses[chainId]
}

const KYBERSWAP_SWAP_API_URL = process.env.KYBERSWAP_SWAP_API_URL || 'https://aggregator-api.kyberswap.com'

const headers: TGetSwapHeaders = {
  'x-client-id': 'DeFi-DEX',
}

export const apiKyberswap = createApi({
  reducerPath: 'apiKyberswap',
  baseQuery: fetchBaseQuery({
    baseUrl: KYBERSWAP_SWAP_API_URL,
    headers,
  }),
  endpoints: (build) => ({
    kyberswapQuerySwapRoute: build.query<
      TGetSwapResponse,
      TGetSwapRequestParams & { chainId: KyberswapSupportedChainId }
    >({
      query: (args) => {
        const { chainId, ...filteredArgs } = args
        const FEE_PAY_TO_ADDRESS = kyberswapFeeAddresses[chainId]
        const params: TGetSwapRequestParams = {
          ...filteredArgs,
          gasInclude: true,
          source: headers['x-client-id'],

          // when edit this, edit swapFee in trade to
          feeAmount: '10',
          isInBps: true,
          chargeFeeBy: 'currency_out',
          feeReceiver: FEE_PAY_TO_ADDRESS,
        }
        if (!chainNames[chainId]) throw new Error('Not supported chain')
        const chainName = chainNames[chainId]
        return {
          method: 'GET',
          url: `/${chainName}/api/v1/routes`,
          params,
        }
      },
    }),
    kyberswapConfirmSwap: build.mutation<
      TGetEncodedDataResponse,
      TGetEncodedDataRequestParams & { chainId: KyberswapSupportedChainId }
    >({
      query: (args) => {
        const { chainId, ...filteredArgs } = args
        const body: TGetEncodedDataRequestParams = {
          ...filteredArgs,
          source: headers['x-client-id'],
          // deadline: Math.round(Date.now() / 1000) + 60 * 15, // now +15 min (in seconds)

          // @ts-ignore
          // skipSimulateTx: false,
          // @ts-ignore
          // enableGasEstimation: true,
        }
        if (!chainNames[chainId]) throw new Error('Not supported chain')
        const chainName = chainNames[chainId]
        return {
          method: 'POST',
          url: `/${chainName}/api/v1/route/build`,
          body,
        }
      },
    }),
  }),
})

export const { useKyberswapQuerySwapRouteQuery, useKyberswapConfirmSwapMutation } = apiKyberswap
