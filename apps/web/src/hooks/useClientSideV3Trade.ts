import { ChainId, Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { Route, SwapQuoter } from '@uniswap/v3-sdk'
import { useWeb3React } from '@web3-react/core'
import JSBI from 'jsbi'
import { useSingleContractWithCallData } from 'lib/hooks/multicall'
import { useEffect, useMemo, useState } from 'react'
import { ClassicTrade, QuoteMethod, TradeState } from 'state/routing/types'

import { nativeOnChain } from 'constants/tokens'
import { formatUnits } from 'ethers/lib/utils'
import { useTickerToUsdQuery } from 'rest/usd/api-usd'
import { useAllV3Routes } from './useAllV3Routes'
import { guesstimateGas } from './useAutoSlippageTolerance'
import { useQuoter } from './useContract'

const QUOTE_GAS_OVERRIDES: { [chainId: number]: number } = {
  // [ChainId.ARBITRUM_ONE]: 25_000_000,
  // [ChainId.ARBITRUM_RINKEBY]: 25_000_000,
  [ChainId.CELO]: 50_000_000,
  [ChainId.CELO_ALFAJORES]: 50_000_000,
  [ChainId.POLYGON]: 40_000_000,
  [ChainId.POLYGON_MUMBAI]: 40_000_000,
}

const DEFAULT_GAS_QUOTE = 2_000_000

/**
 * Returns the best v3 trade for a desired swap
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useClientSideV3Trade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): { state: TradeState; trade?: /* InterfaceTrade<Currency, Currency, TTradeType> */ ClassicTrade } {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT
      ? [amountSpecified?.currency, otherCurrency]
      : [otherCurrency, amountSpecified?.currency]
  const { routes, loading: routesLoading } = useAllV3Routes(currencyIn, currencyOut)

  const { chainId, provider, account } = useWeb3React()
  // Chains deployed using the deploy-v3 script only deploy QuoterV2.
  // const useQuoterV2 = useMemo(() => Boolean(chainId && isCelo(chainId)), [chainId])

  // use v2 always
  const useQuoterV2 = true

  const quoter = useQuoter(useQuoterV2)
  const callData = useMemo(
    () =>
      amountSpecified
        ? routes.map(
            (route) => SwapQuoter.quoteCallParameters(route, amountSpecified, tradeType, { useQuoterV2 }).calldata
          )
        : [],
    [amountSpecified, routes, tradeType, useQuoterV2]
  )

  const quotesResults = useSingleContractWithCallData(quoter, callData, {
    gasRequired: chainId ? QUOTE_GAS_OVERRIDES[chainId] ?? DEFAULT_GAS_QUOTE : undefined,
  })

  const nativeCurrency = nativeOnChain(chainId ?? 1)

  const {
    //
    data: dataTokenUsd,
    isLoading: isLoadingTokenUsd,
  } = useTickerToUsdQuery({ ticker: nativeCurrency.symbol ?? 'UNKNOWN_currency' }, { skip: !nativeCurrency.symbol })

  const [dataFeePerGas, setDataFeePerGas] = useState<Awaited<
    ReturnType<NonNullable<typeof provider>['getFeeData']>
  > | null>(null)
  const [isLoadingFeePerGas, setLoadingFeePerGas] = useState(true)

  useEffect(() => {
    if (!provider) return
    setLoadingFeePerGas(true)
    provider
      .getFeeData()
      .then((v) => {
        setDataFeePerGas(v)
      })
      .catch(() => {
        setDataFeePerGas(null)
      })
      .finally(() => {
        setLoadingFeePerGas(false)
      })
  }, [provider])

  return useMemo(() => {
    if (
      !account ||
      !amountSpecified ||
      !currencyIn ||
      !currencyOut ||
      quotesResults.some(({ valid }) => !valid) ||
      // skip when tokens are the same
      (tradeType === TradeType.EXACT_INPUT
        ? amountSpecified.currency.equals(currencyOut)
        : amountSpecified.currency.equals(currencyIn))
    ) {
      return {
        state: TradeState.INVALID,
        trade: undefined,
      }
    }

    if (routesLoading || isLoadingTokenUsd || isLoadingFeePerGas || quotesResults.some(({ loading }) => loading)) {
      return {
        state: TradeState.LOADING,
        trade: undefined,
      }
    }

    const { bestRoute, amountIn, amountOut } = quotesResults.reduce(
      (
        currentBest: {
          bestRoute: Route<Currency, Currency> | null
          amountIn: CurrencyAmount<Currency> | null
          amountOut: CurrencyAmount<Currency> | null
        },
        { result },
        i
      ) => {
        if (!result) return currentBest

        // overwrite the current best if it's not defined or if this route is better
        if (tradeType === TradeType.EXACT_INPUT) {
          const amountOut = CurrencyAmount.fromRawAmount(currencyOut, result.amountOut.toString())
          if (currentBest.amountOut === null || JSBI.lessThan(currentBest.amountOut.quotient, amountOut.quotient)) {
            return {
              bestRoute: routes[i],
              amountIn: amountSpecified,
              amountOut,
            }
          }
        } else {
          const amountIn = CurrencyAmount.fromRawAmount(currencyIn, result.amountIn.toString())
          if (currentBest.amountIn === null || JSBI.greaterThan(currentBest.amountIn.quotient, amountIn.quotient)) {
            return {
              bestRoute: routes[i],
              amountIn,
              amountOut: amountSpecified,
            }
          }
        }

        return currentBest
      },
      {
        bestRoute: null,
        amountIn: null,
        amountOut: null,
      }
    )

    if (!bestRoute || !amountIn || !amountOut) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: undefined,
      }
    }

    const gasEstimate =
      guesstimateGas(
        new ClassicTrade({
          quoteMethod: QuoteMethod.CLIENT_SIDE_FALLBACK,
          approveInfo: {
            needsApprove: true,
            approveGasEstimateUSD: 0,
          },
          v2Routes: [],
          v3Routes: [
            {
              routev3: bestRoute,
              inputAmount: amountIn,
              outputAmount: amountOut,
            },
          ],
          tradeType,
        })
      ) ?? 0

    const gasPrice = formatUnits(dataFeePerGas?.maxFeePerGas?.mul(gasEstimate) ?? 0, nativeCurrency.decimals)
    const dol = parseFloat(gasPrice) * parseFloat(dataTokenUsd?.result.last ?? '0')
    console.log({ DOL: dol })

    const trade = new ClassicTrade({
      quoteMethod: QuoteMethod.CLIENT_SIDE_FALLBACK,
      gasUseEstimateUSD: dol,
      approveInfo: {
        needsApprove: true,
        approveGasEstimateUSD: 0,
      },
      v2Routes: [],
      v3Routes: [
        {
          routev3: bestRoute,
          inputAmount: amountIn,
          outputAmount: amountOut,
        },
      ],
      tradeType,
    })

    return {
      state: TradeState.VALID,
      trade,
    }
  }, [
    account,
    amountSpecified,
    currencyIn,
    currencyOut,
    quotesResults,
    routes,
    routesLoading,
    tradeType,
    isLoadingTokenUsd,
    dataTokenUsd,
    nativeCurrency.decimals,
    dataFeePerGas?.maxFeePerGas,
    isLoadingFeePerGas,
  ])
}
