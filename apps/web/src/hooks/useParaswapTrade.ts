import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { ParaswapTrade, TradeSource, TradeState } from 'state/routing/types'

import { SwapSide } from '@paraswap/sdk'
import { parseUnits } from 'ethers/lib/utils'
import { GetRateInput, isParaswapSupportedChain, useParaswapQuerySwapRouteQuery } from 'rest/paraswap/api-paraswap'
import useDebounce from './useDebounce'

// const QUOTE_GAS_OVERRIDES: { [chainId: number]: number } = {
//   // [ChainId.ARBITRUM_ONE]: 25_000_000,
//   // [ChainId.ARBITRUM_RINKEBY]: 25_000_000,
//   [ChainId.CELO]: 50_000_000,
//   [ChainId.CELO_ALFAJORES]: 50_000_000,
//   [ChainId.POLYGON]: 40_000_000,
//   [ChainId.POLYGON_MUMBAI]: 40_000_000,
// }

// const DEFAULT_GAS_QUOTE = 2_000_000
const DEBOUNCE_TIME = 900 // 350

/**
 * Returns the best v3 trade for a desired swap
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useParaswapTrade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): TradeSource<ParaswapTrade> {
  // const [currencyIn, currencyOut] = [amountSpecified?.currency, otherCurrency]
  const inputs = useMemo<[CurrencyAmount<Currency> | undefined, Currency | undefined]>(
    () => [amountSpecified, otherCurrency],
    [amountSpecified, otherCurrency]
  )

  const [amountSpecifiedDebounced, otherCurrencyDebounced] = useDebounce(inputs, DEBOUNCE_TIME)

  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT
      ? [amountSpecifiedDebounced?.currency, otherCurrencyDebounced]
      : [otherCurrencyDebounced, amountSpecifiedDebounced?.currency]

  const { chainId, account } = useWeb3React()

  const NATIVE_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

  const args: GetRateInput & { chainId: number } = {
    srcToken: currencyIn?.isNative ? NATIVE_TOKEN_ADDRESS : currencyIn?.wrapped.address ?? '',
    destToken: currencyOut?.isNative ? NATIVE_TOKEN_ADDRESS : currencyOut?.wrapped.address ?? '',
    amount: amountSpecifiedDebounced
      ? parseUnits(amountSpecifiedDebounced.toExact(), amountSpecifiedDebounced.currency.decimals).toString()
      : '',
    userAddress: account,
    side: tradeType === TradeType.EXACT_INPUT ? SwapSide.SELL : SwapSide.BUY, // SwapSide.SELL,
    chainId: chainId || 1,
  }

  const isSupportedChain = isParaswapSupportedChain(chainId)

  const options: Parameters<typeof useParaswapQuerySwapRouteQuery>[1] = {
    skip: !args.srcToken || !args.destToken || !args.amount || !args.chainId || !isSupportedChain,
    pollingInterval: 9000,
  }

  const {
    isLoading: isLoadingParaswap,
    data: dataParaswap,
    error: errorParaswap,
  } = useParaswapQuerySwapRouteQuery(args, options)
  // const resp = useParaswapQuerySwapRouteQuery(args, options)

  // Chains deployed using the deploy-v3 script only deploy QuoterV2.
  // const useQuoterV2 = useMemo(() => Boolean(chainId && isCelo(chainId)), [chainId])

  // use v2 always
  // const useQuoterV2 = true

  // const quoter = useQuoter(useQuoterV2)
  // const callData = useMemo(
  //   () =>
  //     amountSpecified
  //       ? routes.map(
  //         (route) => SwapQuoter.quoteCallParameters(route, amountSpecified, tradeType, { useQuoterV2 }).calldata
  //       )
  //       : [],
  //   [amountSpecified, routes, tradeType, useQuoterV2]
  // )

  // const quotesResults = useSingleContractWithCallData(quoter, callData, {
  //   gasRequired: chainId ? QUOTE_GAS_OVERRIDES[chainId] ?? DEFAULT_GAS_QUOTE : undefined,
  // })

  return useMemo(() => {
    const tokensIsSame =
      tradeType === TradeType.EXACT_INPUT
        ? currencyOut && amountSpecifiedDebounced?.currency.equals(currencyOut)
        : currencyIn && amountSpecifiedDebounced?.currency.equals(currencyIn)

    if (!currencyIn || !currencyOut || !amountSpecifiedDebounced || !chainId || tokensIsSame) {
      // console.warn({
      //   currencyIn,
      //   currencyOut,
      //   amountSpecified,
      //   chainId,
      // })
      return {
        state: TradeState.INVALID,
        trade: undefined,
      }
    }
    //   if (
    //     !amountSpecified ||
    //     !currencyIn ||
    //     !currencyOut ||
    //     quotesResults.some(({ valid }) => !valid) ||
    //     // skip when tokens are the same
    //     (tradeType === TradeType.EXACT_INPUT
    //       ? amountSpecified.currency.equals(currencyOut)
    //       : amountSpecified.currency.equals(currencyIn))
    //   ) {
    //     return {
    //       state: TradeState.INVALID,
    //       trade: undefined,
    //     }
    //   }

    if (isLoadingParaswap) {
      return {
        state: TradeState.LOADING,
        trade: undefined,
      }
    }

    //   if (routesLoading || quotesResults.some(({ loading }) => loading)) {
    //     return {
    //       state: TradeState.LOADING,
    //       trade: undefined,
    //     }
    //   }

    //   const { bestRoute, amountIn, amountOut } = quotesResults.reduce(
    //     (
    //       currentBest: {
    //         bestRoute: Route<Currency, Currency> | null
    //         amountIn: CurrencyAmount<Currency> | null
    //         amountOut: CurrencyAmount<Currency> | null
    //       },
    //       { result },
    //       i
    //     ) => {
    //       if (!result) return currentBest

    //       // overwrite the current best if it's not defined or if this route is better
    //       if (tradeType === TradeType.EXACT_INPUT) {
    //         const amountOut = CurrencyAmount.fromRawAmount(currencyOut, result.amountOut.toString())
    //         if (currentBest.amountOut === null || JSBI.lessThan(currentBest.amountOut.quotient, amountOut.quotient)) {
    //           return {
    //             bestRoute: routes[i],
    //             amountIn: amountSpecified,
    //             amountOut,
    //           }
    //         }
    //       } else {
    //         const amountIn = CurrencyAmount.fromRawAmount(currencyIn, result.amountIn.toString())
    //         if (currentBest.amountIn === null || JSBI.greaterThan(currentBest.amountIn.quotient, amountIn.quotient)) {
    //           return {
    //             bestRoute: routes[i],
    //             amountIn,
    //             amountOut: amountSpecified,
    //           }
    //         }
    //       }

    //       return currentBest
    //     },
    //     {
    //       bestRoute: null,
    //       amountIn: null,
    //       amountOut: null,
    //     }
    //   )

    if (errorParaswap || !dataParaswap) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: undefined,
      }
    }
    //   if (!bestRoute || !amountIn || !amountOut) {
    //     return {
    //       state: TradeState.NO_ROUTE_FOUND,
    //       trade: undefined,
    //     }
    //   }

    // console.log({ dataParaswap })
    // debugger

    return {
      state: TradeState.VALID,
      trade: new ParaswapTrade({
        response: dataParaswap,
        tradeType,
        // chainId,
        currencyIn,
        currencyOut,
      }),
      // trade: new ClassicTrade({
      //   quoteMethod: QuoteMethod.ROUTING_API, // QuoteMethod.CLIENT_SIDE_FALLBACK,
      //   // approveInfo: ApproveInfo
      //   // FIXME: replace hardcode with alive data.
      //   approveInfo: {
      //     needsApprove: true,
      //     approveGasEstimateUSD: 0,
      //   },
      //   // swapFee: getSwapFee(quotesResults[0]),
      //   v2Routes: [],
      //   v3Routes: [
      //     {
      //       routev3: bestRoute,
      //       inputAmount: amountIn,
      //       outputAmount: amountOut,
      //     },
      //   ],
      //   tradeType,
      // }),
    }
  }, [
    amountSpecifiedDebounced,
    currencyIn,
    currencyOut,
    isLoadingParaswap,
    chainId,
    dataParaswap,
    errorParaswap,
    tradeType,
  ])
}
