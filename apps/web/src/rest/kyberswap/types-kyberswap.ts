import { ChainId } from '@uniswap/sdk-core'

export type KyberswapSupportedChainId =
  | ChainId.MAINNET
  | ChainId.BNB
  | ChainId.ARBITRUM_ONE
  | ChainId.POLYGON
  | ChainId.OPTIMISM
  | ChainId.AVALANCHE
  | ChainId.BASE

/**
 * ClientID of the party calling the API. Please use the same ClientID as the `source` in the body.
 */
type TKyberswapClientId = 'DeFi-DEX'

export type TGetSwapHeaders = {
  'x-client-id': TKyberswapClientId
}

export type TGetSwapRequestParams = {
  /**
   * Address of the input token 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE in case of native token
   * TODO: implement native token using this string
   */
  tokenIn: string | '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

  /**
   * Address of the output token 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE in case of native token
   * TODO: implement native token using this string
   */
  tokenOut: string | '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

  /**
   * Amount of the input token (in wei)
   */
  amountIn: string

  /**
   * `false`/`0` = route will be based on the maximum output token returned `true`/`1` = route will be based on the lowest gas cost (i.e. the least hops)
   */
  saveGas?: boolean | 0 | 1

  /**
   * DEX IDs included in the route, separated by comma
   */
  includedSources?: string

  /**
   * DEX IDs excluded from the route, separated by comma
   */
  excludedSources?: string

  /**
   * Determines whether gas costs are included when searching for route
   */
  gasInclude?: boolean

  /**
   * Estimated price of gas required for swap, in wei units
   */
  gasPrice?: string

  /**
   * Fee amount to be collected
   * if `isInBps` = `true`, `feeAmount` is the percentage of fees that we will take
   * with base unit = 10000, i.e `feeAmount` = 10
   * and `isInBps` = `true` then `fee` = 0.1 % if `isInBps` = `false`, `feeAmount` is the amount
   * of token that we will take as fee, i.e `feeAmount` = 10 and `isInBps` = `false` then `fee` = 10 token weis
   */
  feeAmount?: string

  /**
   * Indicates whether fee is charged by input token `currency_in` or output token `currency_out`
   * Default is empty whereby no fee is charged
   */
  chargeFeeBy?: 'currency_in' | 'currency_out'

  /**
   * if true, fee is taken in BPS
   */
  isInBps?: boolean

  /**
   * Address to receive fee (if chargeFeeBy is not empty)
   */
  feeReceiver?: string

  /**
   * ClientID of the party calling the API. Please use the same ClientID as the `x-client-id` in the header.
   */
  source?: TKyberswapClientId
}

export type TGetSwapResponse = {
  /**
   * Response code
   */
  code: string

  /**
   * Response message
   */
  message: string
  data: {
    routeSummary: {
      /**
       * The input token for the swap
       */
      tokenIn: string

      /**
       * The amount of input token for the swap in wei
       */
      amountIn: string

      /**
       * Estimate of input value, in USD
       */
      amountInUsd: string

      /**
       * Indicates tokenIn external market price availability at time of query
       */
      tokenInMarketPriceAvailable: boolean

      /**
       * The output token for the swap
       */
      tokenOut: string

      /**
       * The amount of output token for the swap in wei
       */
      amountOut: string

      /**
       * Estimate of output value, in USD
       */
      amountOutUsd: string

      /**
       * Indicates tokenOut external market price availability at time of query
       */
      tokenOutMarketPriceAvailable: boolean

      /**
       * Estimated gas required for swap
       */
      gas: string

      /**
       * Estimated price of gas required for swap, in wei units
       */
      gasPrice: string

      /**
       * Estimated USD price of gas required for swap
       */
      gasUsd: string

      /**
       * Fee configuration for the swap
       */
      extraFee: {
        /**
         * Fee amount to be collected
         * if `isInBps` = `true`, `feeAmount` is the percentage of fees that we will take
         * with base unit = 10000, i.e `feeAmount` = 10
         * and `isInBps` = `true` then `fee` = 0.1 % if `isInBps` = `false`, `feeAmount` is the amount
         * of token that we will take as fee, i.e `feeAmount` = 10 and `isInBps` = `false` then `fee` = 10 token weis
         */
        feeAmount: string

        /**
         * Indicates whether fee is charged by input token `currency_in` or output token `currency_out`
         * Default is empty whereby no fee is charged
         */
        chargeFeeBy: 'currency_in' | 'currency_out'

        /**
         * If true, fee is taken in BPS
         */
        isInBps: boolean

        /**
         * Address which the fees will be sent to
         */
        feeReceiver: string
      }

      /**
       * Array of swap routes
       */
      route: [
        [
          {
            /**
             * Address of the pool which the swap has been routed to
             */
            pool: string

            /**
             * The input token address for this pool
             */
            tokenIn: string

            /**
             * The output token address for this pool
             */
            tokenOut: string

            /**
             * Maximum for amount of output token returned. Set to zero
             * as using minReturnAmount instead
             */
            limitReturnAmount: string

            /**
             * The amount of input token to be swapped through this pool, in wei
             */
            swapAmount: string

            /**
             * The amount of output token received through swapping through this pool, in wei
             */
            amountOut: string

            /**
             * The exchange where the pool originated from
             */
            exchange: string

            /**
             * Number of tokens in the pool
             */
            poolLength: number

            /**
             * The pool type as defined by our internal aggregator
             */
            poolType: string

            /**
             * Additional pool metadata
             */
            poolExtra: string

            /**
             * Additional swap metadata
             */
            extra: string
          }
        ]
      ]
    }

    /**
     * The KyberSwap router address
     */
    routerAddress: string
  }
}

export type TGetEncodedDataRequestParams = {
  /**
   * The summarised routing data
   */
  routeSummary: TGetSwapResponse['data']['routeSummary']

  /**
   * Deadline (in Unix time second) for the transaction to be executed.
   * Default will be +20 minute. Cannot be in the past.
   */
  deadline?: number

  /**
   * This is the amount of slippage the user can accept for his trade.
   * The unit is bip. The value is in ranges [0, 2000],
   * 10 means 0.1%. If no value is provided, slippageTolerance will be set to 0.
   */
  slippageTolerance: number

  /**
   * Address which the swap input tokens will be debited from
   */
  sender: string

  /**
   * Address which the swap output tokens will be sent to
   */
  recipient: string

  /**
   * ClientID of the party calling the API.
   * Please use the same ClientID as the x-client-id in the header.
   */
  source: string
}

export type TGetEncodedDataResponse = {
  /**
   * Response code
   */
  code: string

  /**
   * Response message
   */
  message: string
  data: {
    /**
     * The amount of input token for the swap in wei
     */
    amountIn: string

    /**
     * Estimated input value, in USD
     */
    amountInUsd: string

    /**
     * The amount of output token for the swap in wei
     */
    amountOut: string

    /**
     * Estimated output value, in USD
     */
    amountOutUsd: string

    /**
     * Estimated gas required for swap
     */
    gas: string

    /**
     * Estimated USD price of gas required for swap
     */
    gasUsd: string

    // outputChange: {
    //   amount: string
    //   percent: 0
    //   level: 0
    // }

    /**
     * The encoded data to be sent to KyberSwap router address
     */
    data: string

    /**
     * The KyberSwap router address
     */
    routerAddress: string
  }
}
