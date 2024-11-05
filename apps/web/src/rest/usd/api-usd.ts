import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
type TToUsdResponse = {
  code: number // 200
  success: boolean // true
  message: string // ''
  result: {
    name: string // 'ETH_USDT'
    bid: string // '3489.44930211'
    ask: string // '3489.45069789'
    open: string // '3467.9993064'
    high: string // '3489.65930207'
    low: string // '3376.77'
    last: string // '3489.64930207'
    volume: string // '3899.26275323'
    deal: string // '13369117.2333929217'
    change: string // '0.6223365647875039177'
  }
}

export const apiUsd = createApi({
  reducerPath: 'apiUsd',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.exchange.pointpay.io/api/v1/public',
    // credentials: 'same-origin',
    // credentials: 'omit',
  }),
  endpoints: (build) => ({
    tickerToUsd: build.query<TToUsdResponse, { ticker: string }>({
      keepUnusedDataFor: 60 * 10, // 10 mins
      query: (args) => {
        // const { chainId, ...filteredArgs } = args
        // https://api.exchange.pointpay.io/api/v1/public/ticker?market=ETH_USDT
        return {
          method: 'GET',
          url: `/ticker`,
          params: { market: `${args.ticker}_USDT` },
        }
      },
    }),
    // feePerGas: build.query({
    //   async queryFn(fn: Provider['getFeeData']) {
    //     try {
    //       const feeData = await fn()
    //       return { data: feeData }
    //     } catch (e) {
    //       return { error: { status: 'CUSTOM_ERROR', error: e?.detail ?? e?.message ?? e } }
    //     }
    //   },
    // }),
  }),
})

// eslint-disable-next-line
export const { useTickerToUsdQuery } = apiUsd
