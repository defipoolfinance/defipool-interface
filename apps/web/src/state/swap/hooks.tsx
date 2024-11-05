import { Trans } from '@lingui/macro'
import { Currency, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { Field } from 'components/swap/constants'
import { useConnectionReady } from 'connection/eagerlyConnect'
import useAutoSlippageTolerance from 'hooks/useAutoSlippageTolerance'
import { useDebouncedTrade } from 'hooks/useDebouncedTrade'
import { useSwapTaxes } from 'hooks/useSwapTaxes'
import { useUSDPrice } from 'hooks/useUSDPrice'
import tryParseCurrencyAmount from 'lib/utils/tryParseCurrencyAmount'
import { ParsedQs } from 'qs'
import { ReactNode, useCallback, useMemo } from 'react'
import { OperableTrade, TradeSource, TradeState } from 'state/routing/types'
import { isClassicTrade, isSubmittableTrade } from 'state/routing/utils'
import { useUserSlippageToleranceWithDefault } from 'state/user/hooks'
import { isAddress } from 'utilities/src/addresses'

import { useKyberswapTrade } from 'hooks/useKyberswapTrade'
import { useParaswapTrade } from 'hooks/useParaswapTrade'
import { TOKEN_SHORTHANDS } from '../../constants/tokens'
import { useCurrencyBalances } from '../connection/hooks'
import {
  CurrencyState,
  SerializedCurrencyState,
  SwapState,
  useSwapAndLimitContext,
  useSwapContext,
} from './SwapContext'

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: (options: { newOutputHasTax: boolean; previouslyEstimatedOutput: string }) => void
  onUserInput: (field: Field, typedValue: string) => void
} {
  const { swapState, setSwapState } = useSwapContext()
  const { currencyState, setCurrencyState } = useSwapAndLimitContext()

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      const [currentCurrencyKey, otherCurrencyKey]: (keyof CurrencyState)[] =
        field === Field.INPUT ? ['inputCurrency', 'outputCurrency'] : ['outputCurrency', 'inputCurrency']
      // the case where we have to swap the order
      if (currency === currencyState[otherCurrencyKey]) {
        setCurrencyState({
          [currentCurrencyKey]: currency,
          [otherCurrencyKey]: currencyState[currentCurrencyKey],
        })
        setSwapState((swapState) => ({
          ...swapState,
          independentField: swapState.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        }))
      } else {
        setCurrencyState((state) => ({
          ...state,
          [currentCurrencyKey]: currency,
        }))
      }
    },
    [currencyState, setCurrencyState, setSwapState]
  )

  const onSwitchTokens = useCallback(
    ({
      newOutputHasTax,
      previouslyEstimatedOutput,
    }: {
      newOutputHasTax: boolean
      previouslyEstimatedOutput: string
    }) => {
      // To prevent swaps with FOT tokens as exact-outputs, we leave it as an exact-in swap and use the previously estimated output amount as the new exact-in amount.
      if (newOutputHasTax && swapState.independentField === Field.INPUT) {
        setSwapState((swapState) => ({
          ...swapState,
          typedValue: previouslyEstimatedOutput,
        }))
      } else {
        setSwapState((prev) => ({
          ...prev,
          independentField: prev.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        }))
      }

      setCurrencyState((prev) => ({
        inputCurrency: prev.outputCurrency,
        outputCurrency: prev.inputCurrency,
      }))
    },
    [setCurrencyState, setSwapState, swapState.independentField]
  )

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSwapState((state) => {
        return {
          ...state,
          independentField: field,
          typedValue,
        }
      })
    },
    [setSwapState]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
  }
}

export type SwapInfo = {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  inputTax: Percent
  outputTax: Percent
  outputFeeFiatValue?: number
  parsedAmount?: CurrencyAmount<Currency>
  inputError?: ReactNode
  trade: {
    trade?: OperableTrade // ClassicTrade // InterfaceTrade
    state: TradeState
    uniswapXGasUseEstimateUSD?: number
    error?: any
    swapQuoteLatency?: number
  }
  allowedSlippage: Percent
  autoSlippage: Percent
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(state: SwapState): SwapInfo {
  const { account } = useWeb3React()

  const {
    currencyState: { inputCurrency, outputCurrency },
  } = useSwapAndLimitContext()
  const { independentField, typedValue } = state

  const { inputTax, outputTax } = useSwapTaxes(
    inputCurrency?.isToken ? inputCurrency.address : undefined,
    outputCurrency?.isToken ? outputCurrency.address : undefined
  )

  // ✅
  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency])
  )

  // ✅
  const isExactIn: boolean = independentField === Field.INPUT
  // ✅
  const parsedAmount = useMemo(
    () => tryParseCurrencyAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined),
    [inputCurrency, isExactIn, outputCurrency, typedValue]
  )

  const params: [
    Parameters<typeof useKyberswapTrade>[0] | Parameters<typeof useDebouncedTrade>[0],
    Parameters<typeof useKyberswapTrade>[1] | Parameters<typeof useDebouncedTrade>[1],
    Parameters<typeof useKyberswapTrade>[2] | Parameters<typeof useDebouncedTrade>[2]
  ] = [
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    parsedAmount,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
  ]

  // console.warn('PARAMS:::', JSON.parse(JSON.stringify(params)))

  // Classic Trade
  // eslint-disable-next-line
  const classicTrade = useDebouncedTrade(...params, undefined, account)

  // Paraswap Trade
  // eslint-disable-next-line
  const paraswapTrade = useParaswapTrade(...params)

  // Kyberswap Trade
  // eslint-disable-next-line
  const kyberswapTrade = useKyberswapTrade(...params)

  // console.warn('kyberswapTrade::', kyberswapTrade)

  const trade = getBestTradeAmongAllProviders([
    // ...(chainId === ChainId.BNB ? [paraswapTrade] : [classicTrade]),
    classicTrade,
    kyberswapTrade,
    paraswapTrade,
  ])

  const { data: outputFeeFiatValue } = useUSDPrice(
    isSubmittableTrade(trade.trade) && trade.trade.swapFee
      ? CurrencyAmount.fromRawAmount(trade.trade.outputAmount.currency, trade.trade.swapFee.amount)
      : undefined,
    trade.trade?.outputAmount.currency
  )

  // ✅
  const currencyBalances = useMemo(
    () => ({
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }),
    [relevantTokenBalances]
  )

  // ✅
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency,
      [Field.OUTPUT]: outputCurrency,
    }),
    [inputCurrency, outputCurrency]
  )

  // ✅
  // allowed slippage for classic trades is either auto slippage, or custom user defined slippage if auto slippage disabled
  const classicAutoSlippage = useAutoSlippageTolerance(isClassicTrade(trade.trade) ? trade.trade : undefined)

  // ❌
  // slippage for uniswapx trades is defined by the quote response
  // const uniswapXAutoSlippage = isUniswapXTrade(trade.trade) ? trade.trade.slippageTolerance : undefined

  // DeFi Pool interface recommended slippage amount
  const autoSlippage = /* uniswapXAutoSlippage ?? */ classicAutoSlippage
  // ✅
  const classicAllowedSlippage = useUserSlippageToleranceWithDefault(autoSlippage)

  // slippage amount used to submit the trade
  const allowedSlippage = /* uniswapXAutoSlippage ?? */ classicAllowedSlippage

  const connectionReady = useConnectionReady()
  // ✅
  const inputError = useMemo(() => {
    let inputError: ReactNode | undefined

    if (!account) {
      inputError = connectionReady ? <Trans>Connect wallet</Trans> : <Trans>Connecting wallet...</Trans>
    }

    if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
      inputError = inputError ?? <Trans>Select a token</Trans>
    }

    if (!parsedAmount) {
      inputError = inputError ?? <Trans>Enter an amount</Trans>
    }

    // compare input balance to max input based on version
    const [balanceIn, maxAmountIn] = [currencyBalances[Field.INPUT], trade?.trade?.maximumAmountIn(allowedSlippage)]

    if (balanceIn && maxAmountIn && balanceIn.lessThan(maxAmountIn)) {
      inputError = <Trans>Insufficient {balanceIn.currency.symbol} balance</Trans>
    }

    return inputError
  }, [account, currencies, parsedAmount, currencyBalances, trade?.trade, allowedSlippage, connectionReady])

  return useMemo(
    () => ({
      currencies,
      currencyBalances,
      parsedAmount,
      inputError,
      trade,
      autoSlippage,
      allowedSlippage,
      outputFeeFiatValue,
      inputTax,
      outputTax,
    }),
    [
      allowedSlippage,
      autoSlippage,
      currencies,
      currencyBalances,
      inputError,
      outputFeeFiatValue,
      parsedAmount,
      trade,
      inputTax,
      outputTax,
    ]
  )
}

// export enum TradeState {
//   LOADING = 'loading',
//   INVALID = 'invalid',
//   STALE = 'stale',
//   NO_ROUTE_FOUND = 'no_route_found',
//   VALID = 'valid',
// }

function getBestTradeAmongAllProviders(sources: TradeSource<OperableTrade>[]): TradeSource<OperableTrade> {
  // wait all sources to be loaded
  const someLoading = sources.find((s) => s.state === TradeState.LOADING)
  if (someLoading) return someLoading

  // get best trade from loaded trades
  const trades = sources
    //
    .map((s) => s.trade)
    .filter((t) => !!t)
  // @ts-ignore
  // .filter((s) => s.fillType === TradeFillType.Kyberswap) // FIXME: remove, its for debug

  const bestTrade: OperableTrade | null = (() => {
    if (!trades.length) return null
    if (trades.length === 1) return trades[0] ?? null
    return (
      trades.reduce((prev, next) => {
        if (!prev || !next) throw new Error('must be prev and next')
        // EXACT_INPUT
        if (prev.tradeType === next.tradeType && next.tradeType === TradeType.EXACT_INPUT) {
          return prev.outputAmount.greaterThan(next.outputAmount) ? prev : next
        }
        // EXACT_OUTPUT
        if (prev.tradeType === next.tradeType && next.tradeType === TradeType.EXACT_OUTPUT) {
          return prev.inputAmount.greaterThan(next.inputAmount) ? next : prev
        }

        throw new Error('Different TradeType in bestTrade')
      }) ?? null
    )
  })()

  // debugger
  // console.clear()
  // console.log({
  //   sources,
  //   bestTrade,
  //   states: JSON.stringify(
  //     (sources ?? []).map((s) => s.state),
  //     null,
  //     2
  //   ),
  //   prices: JSON.stringify([
  //     //
  //     sources[0]?.trade?.tradeType === TradeType.EXACT_INPUT
  //       ? sources[0]?.trade?.outputAmount.toFixed(4)
  //       : sources[0]?.trade?.inputAmount.toFixed(4),
  //     sources[0]?.trade?.tradeType === TradeType.EXACT_INPUT
  //       ? sources[1]?.trade?.outputAmount.toFixed(4)
  //       : sources[1]?.trade?.inputAmount.toFixed(4),
  //     sources[0]?.trade?.tradeType === TradeType.EXACT_INPUT
  //       ? sources[2]?.trade?.outputAmount.toFixed(4)
  //       : sources[2]?.trade?.inputAmount.toFixed(4),
  //   ]),
  // })

  const bestTradeSource = sources.find((s) => !!bestTrade && s.trade === bestTrade)
  if (bestTradeSource) return bestTradeSource

  // other cases like INVALID or NO_ROUTE_FOUND
  const stale = sources.find((s) => s.state === TradeState.STALE)
  if (stale) return stale

  const notFound = sources.find((s) => s.state === TradeState.NO_ROUTE_FOUND)
  if (notFound) return notFound

  const invalid = sources.find((s) => s.state === TradeState.INVALID)
  if (invalid) return invalid

  throw new Error('Unhandled TradeState')
}

function parseCurrencyFromURLParameter(urlParam: ParsedQs[string]): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    const upper = urlParam.toUpperCase()
    if (upper === 'ETH') return 'ETH'
    if (upper in TOKEN_SHORTHANDS) return upper
  }
  return ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

export function queryParametersToCurrencyState(parsedQs: ParsedQs): SerializedCurrencyState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency ?? parsedQs.inputcurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency ?? parsedQs.outputcurrency)
  const independentField = parseIndependentFieldURLParameter(parsedQs.exactField)

  if (inputCurrency === '' && outputCurrency === '' && independentField === Field.INPUT) {
    // Defaults to having the native currency selected
    inputCurrency = 'ETH'
  } else if (inputCurrency === outputCurrency) {
    // clear output if identical
    outputCurrency = ''
  }

  return {
    inputCurrencyId: inputCurrency === '' ? undefined : inputCurrency ?? undefined,
    outputCurrencyId: outputCurrency === '' ? undefined : outputCurrency ?? undefined,
  }
}

export function queryParametersToSwapState(parsedQs: ParsedQs): SwapState {
  const typedValue = parseTokenAmountURLParameter(parsedQs.exactAmount)
  const independentField = parseIndependentFieldURLParameter(parsedQs.exactField)

  return {
    typedValue,
    independentField,
  }
}
