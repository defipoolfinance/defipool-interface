import { Percent, TradeType } from '@uniswap/sdk-core'
import { FlatFeeOptions } from '@uniswap/universal-router-sdk'
import { FeeOptions } from '@uniswap/v3-sdk'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers/lib/ethers'
import { PermitSignature } from 'hooks/usePermitAllowance'
import { ReactNode, useCallback } from 'react'
import { InterfaceTrade, OperableTrade, TradeFillType } from 'state/routing/types'
import { isClassicTrade, isKyberswapTrade, isParaswapTrade, isUniswapXTrade } from 'state/routing/utils'
import { useAddOrder } from 'state/signatures/hooks'
import { UniswapXOrderDetails } from 'state/signatures/types'

import {
  SwapCallbackState,
  useKyberswapCallback,
  useLibSwapCallBack,
  useParaswapCallback,
} from 'lib/hooks/swap/useLibSwapCallBack'
import { useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import {
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  TransactionType,
} from '../state/transactions/types'
import { currencyId } from '../utils/currencyId'
import useENS from './useENS'
import { SignatureData } from './useERC20Permit'
import useTransactionDeadline from './useTransactionDeadline'
import { useUniswapXSwapCallback } from './useUniswapXSwapCallback'
import { useUniversalRouterSwapCallback } from './useUniversalRouter'

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallbackV2(
  trade: OperableTrade | undefined, // ClassicTrade | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | undefined | null
  // ) {
  // ): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: ReactNode | null } {
): {
  state: SwapCallbackState
  callback:
    | null
    | (() => Promise<{
        type: TradeFillType.Classic
        response: Awaited<ReturnType<NonNullable<ReturnType<ReturnType<typeof useLibSwapCallBack>>['callback']>>> // TransactionResponse
        deadline?: BigNumber
      }>)
  error: ReactNode | null
} {
  const { account } = useWeb3React()

  const deadline = useTransactionDeadline()

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const simpleRouterFn = useLibSwapCallBack({
    trade: isClassicTrade(trade) ? trade : undefined,
    allowedSlippage,
    recipientAddressOrName: recipient,
    signatureData,
    deadline,
  })

  const kyberswapCallbackFn = useKyberswapCallback({
    trade: isKyberswapTrade(trade) ? trade : undefined,
    allowedSlippage,
    recipientAddressOrName: recipient,
    signatureData,
    deadline,
  })

  const paraswapCallbackFn = useParaswapCallback({
    trade: isParaswapTrade(trade) ? trade : undefined,
    allowedSlippage,
    recipientAddressOrName: recipient,
    signatureData,
    deadline,
  })

  const {
    //
    state,
    callback: libCallback,
    error,
    // encodedData,
  } = isKyberswapTrade(trade) ? kyberswapCallbackFn() : isParaswapTrade(trade) ? paraswapCallbackFn() : simpleRouterFn()

  // TODO: add swap callback to this cases ???

  const callback = useMemo(() => {
    if (!libCallback || !trade) {
      return null
    }
    return () =>
      libCallback().then((response) => {
        addTransaction(
          response,
          trade.tradeType === TradeType.EXACT_INPUT
            ? {
                isUniswapXOrder: false,
                type: TransactionType.SWAP,
                tradeType: TradeType.EXACT_INPUT,
                inputCurrencyId: currencyId(trade.inputAmount.currency),
                inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
                expectedOutputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
                outputCurrencyId: currencyId(trade.outputAmount.currency),
                minimumOutputCurrencyAmountRaw: trade.minimumAmountOut(allowedSlippage).quotient.toString(),
              }
            : {
                isUniswapXOrder: false,
                type: TransactionType.SWAP,
                tradeType: TradeType.EXACT_OUTPUT,
                inputCurrencyId: currencyId(trade.inputAmount.currency),
                maximumInputCurrencyAmountRaw: trade.maximumAmountIn(allowedSlippage).quotient.toString(),
                outputCurrencyId: currencyId(trade.outputAmount.currency),
                outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
                expectedInputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
              }
        )
        // return response.hash
        return { type: TradeFillType.Classic as const, response, deadline }
      })
  }, [addTransaction, allowedSlippage, libCallback, trade, deadline])

  return {
    state,
    callback,
    error,
  }
}

export type SwapResult = Awaited<ReturnType<ReturnType<typeof useSwapCallback>>>

type UniversalRouterFeeField = { feeOptions: FeeOptions } | { flatFeeOptions: FlatFeeOptions }

/**
 * @deprecated universal-router
 */
function getUniversalRouterFeeFields(trade?: InterfaceTrade): UniversalRouterFeeField | undefined {
  if (!isClassicTrade(trade)) return undefined
  if (!trade.swapFee) return undefined

  if (trade.tradeType === TradeType.EXACT_INPUT) {
    return { feeOptions: { fee: trade.swapFee.percent, recipient: trade.swapFee.recipient } }
  } else {
    return { flatFeeOptions: { amount: BigNumber.from(trade.swapFee.amount), recipient: trade.swapFee.recipient } }
  }
}

// Returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: InterfaceTrade | undefined, // trade to execute, required
  fiatValues: { amountIn?: number; amountOut?: number; feeUsd?: number }, // usd values for amount in and out, and the fee value, logged for analytics
  allowedSlippage: Percent, // in bips
  permitSignature: PermitSignature | undefined
) {
  const addTransaction = useTransactionAdder()
  const addOrder = useAddOrder()
  const { account, chainId } = useWeb3React()

  /**
   * @deprecated uniswap-x
   */
  const uniswapXSwapCallback = useUniswapXSwapCallback({
    trade: isUniswapXTrade(trade) ? trade : undefined,
    allowedSlippage,
    fiatValues,
  })

  /**
   * @deprecated universal-router
   */
  const universalRouterSwapCallback = useUniversalRouterSwapCallback(
    isClassicTrade(trade) ? trade : undefined,
    fiatValues,
    {
      slippageTolerance: allowedSlippage,
      permit: permitSignature,
      ...getUniversalRouterFeeFields(trade),
    }
  )

  const swapCallback = isUniswapXTrade(trade) ? uniswapXSwapCallback : universalRouterSwapCallback

  return useCallback(async () => {
    if (!trade) throw new Error('missing trade')
    if (!account || !chainId) throw new Error('wallet must be connected to swap')

    const result = await swapCallback()

    const swapInfo: ExactInputSwapTransactionInfo | ExactOutputSwapTransactionInfo = {
      type: TransactionType.SWAP,
      inputCurrencyId: currencyId(trade.inputAmount.currency),
      outputCurrencyId: currencyId(trade.outputAmount.currency),
      isUniswapXOrder: result.type === TradeFillType.UniswapX,
      ...(trade.tradeType === TradeType.EXACT_INPUT
        ? {
            tradeType: TradeType.EXACT_INPUT,
            inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
            expectedOutputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
            minimumOutputCurrencyAmountRaw: trade.minimumAmountOut(allowedSlippage).quotient.toString(),
          }
        : {
            tradeType: TradeType.EXACT_OUTPUT,
            maximumInputCurrencyAmountRaw: trade.maximumAmountIn(allowedSlippage).quotient.toString(),
            outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
            expectedInputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
          }),
    }

    if (result.type === TradeFillType.UniswapX) {
      addOrder(
        account,
        result.response.orderHash,
        chainId,
        result.response.deadline,
        swapInfo as UniswapXOrderDetails['swapInfo'],
        result.response.encodedOrder,
        isUniswapXTrade(trade) ? trade.offchainOrderType : undefined
      )
    } else {
      addTransaction(result.response, swapInfo, result.deadline?.toNumber())
    }

    return result
  }, [account, addOrder, addTransaction, allowedSlippage, chainId, swapCallback, trade])
}
