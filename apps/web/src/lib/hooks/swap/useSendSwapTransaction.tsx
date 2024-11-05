import { BigNumber } from '@ethersproject/bignumber'
import type { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers'
// eslint-disable-next-line no-restricted-imports
import { t, Trans } from '@lingui/macro'
import { BuildSwapTxInput, TransactionParams } from '@paraswap/sdk'
// import { sendAnalyticsEvent } from '@uniswap/analytics'
// import { EventName } from '@uniswap/analytics-events'
import { Trade } from '@uniswap/router-sdk'
import { ChainId, Currency, Percent, TradeType } from '@uniswap/sdk-core'
import { formatPercentInBasisPointsNumber } from 'lib/utils/analytics'
// import { formatSwapSignedAnalyticsEventProperties } from 'lib/utils/analytics'
import { useMemo } from 'react'
import { useKyberswapConfirmSwapMutation } from 'rest/kyberswap/api-kyberswap'
import { KyberswapSupportedChainId, TGetEncodedDataResponse } from 'rest/kyberswap/types-kyberswap'
import { useParaswapConfirmSwapMutation } from 'rest/paraswap/api-paraswap'
import { KyberswapTrade, ParaswapTrade } from 'state/routing/types'
import { useUserSlippageToleranceWithDefault } from 'state/user/hooks'
// import { SubmittableTrade } from 'state/routing/types'
import { calculateGasMargin } from 'utils/calculateGasMargin'
import isZero from 'utils/isZero'
import { swapErrorToUserReadableMessage } from 'utils/swapErrorToUserReadableMessage'

interface SwapCall {
  address: string
  calldata: string
  value: string
}

interface SwapCallEstimate {
  call: SwapCall
}

interface SuccessfulCall extends SwapCallEstimate {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall extends SwapCallEstimate {
  call: SwapCall
  error: Error
}

class InvalidSwapError extends Error {}

// returns a function that will execute a swap, if the parameters are all valid
export default function useSendSwapTransaction(
  account: string | null | undefined,
  chainId: number | undefined,
  provider: JsonRpcProvider | undefined,
  trade: Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  swapCalls: SwapCall[]
): { callback: null | (() => Promise<TransactionResponse>) } {
  return useMemo(() => {
    if (!trade || !provider || !account || !chainId) {
      return { callback: null }
    }
    return {
      callback: async function onSwap(): Promise<TransactionResponse> {
        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const { address, calldata, value } = call

            const tx =
              !value || isZero(value)
                ? { from: account, to: address, data: calldata }
                : {
                    from: account,
                    to: address,
                    data: calldata,
                    value,
                  }

            return provider
              .estimateGas(tx)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call)
                return provider
                  .call(tx)
                  .then((result) => {
                    console.error({
                      call,
                      gasError,
                      result,
                      tx,
                    })
                    if (gasError.reason === 'execution reverted: STF') {
                      console.error('The reason is there is no tokens or no allowance.')
                    }
                    console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: <Trans>Unexpected issue with estimating the gas. Please try again.</Trans> }
                  })
                  .catch((callError) => {
                    console.debug('Call threw error', call, callError)
                    return { call, error: swapErrorToUserReadableMessage(callError) }
                  })
              })
          })
        )

        console.log('estimatedCalls::', estimatedCalls)

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        // check if any calls errored with a recognizable error
        if (!bestCallOption) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          const firstNoErrorCall = estimatedCalls.find<SwapCallEstimate>(
            (call): call is SwapCallEstimate => !('error' in call)
          )
          if (!firstNoErrorCall) throw new Error(t`Unexpected error. Could not estimate gas for the swap.`)
          bestCallOption = firstNoErrorCall
        }

        const {
          call: { address, calldata, value },
        } = bestCallOption

        return provider
          .getSigner()
          .sendTransaction({
            from: account,
            to: address,
            data: calldata,
            // let the wallet try if we can't estimate the gas
            ...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
            ...(value && !isZero(value) ? { value } : {}),
          })
          .then((response) => {
            // sendAnalyticsEvent(
            //   EventName.SWAP_SIGNED,
            //   formatSwapSignedAnalyticsEventProperties({ trade, txHash: response.hash })
            // )
            if (calldata !== response.data) {
              // sendAnalyticsEvent(EventName.SWAP_MODIFIED_IN_WALLET, { txHash: response.hash })
              throw new InvalidSwapError(
                t`Your swap was modified through your wallet. If this was a mistake, please cancel immediately or risk losing your funds.`
              )
            }
            return response
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error(t`Transaction rejected`)
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, address, calldata, value)

              if (error instanceof InvalidSwapError) {
                throw error
              } else {
                throw new Error(t`Swap failed: ${swapErrorToUserReadableMessage(error)}`)
              }
            }
          })
      },
    }
  }, [account, chainId, provider, swapCalls, trade])
}

const DEFAULT_KYBERSWAP_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)
type PostParams = Parameters<ReturnType<typeof useKyberswapConfirmSwapMutation>[0]>

// returns a function that will execute a swap, if the parameters are all valid
export function useSendKyberswapTransaction(
  account: string | null | undefined,
  chainId: number | undefined,
  provider: JsonRpcProvider | undefined,
  trade: KyberswapTrade | undefined, // trade to execute, required
  deadline: BigNumber | undefined
): {
  callback: null | (() => Promise<TransactionResponse>)
  isLoadingKyberswap: boolean
} {
  const slippageTolerance = formatPercentInBasisPointsNumber(
    useUserSlippageToleranceWithDefault(DEFAULT_KYBERSWAP_SLIPPAGE_TOLERANCE)
  )

  const [mutateConfirm, { isLoading: isLoadingKyberswap, reset: resetMutationCache }] =
    useKyberswapConfirmSwapMutation()

  return useMemo(() => {
    if (!trade || !provider || !account || !chainId) {
      return { callback: null, isLoadingKyberswap: false }
    }
    return {
      isLoadingKyberswap,
      callback: async function onSwap(): Promise<TransactionResponse> {
        resetMutationCache()
        const args = {
          routeSummary: trade.summary,
          slippageTolerance,
          sender: account,
          recipient: account,
          chainId: chainId as KyberswapSupportedChainId,
          deadline: deadline?.toNumber() ?? undefined,
          source: '',
        } satisfies PostParams[0]

        const d = await mutateConfirm(args)

        const {
          data: { data: swapData },
        } = d as { data: TGetEncodedDataResponse }

        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress()

        const tx = {
          data: swapData.data,
          from: signerAddress,
          to: swapData.routerAddress,

          // specify value only for native token
          ...(trade.currencyAmountIn.currency.isNative ? { value: swapData.amountIn } : {}),
        }

        const gasLimit = await await signer
          .estimateGas(tx)
          .then(calculateGasMargin)
          .catch(() => calculateGasMargin(BigNumber.from(swapData.gas)))

        const txWithGas: Parameters<typeof signer.sendTransaction>[0] = {
          ...tx,
          gasLimit,
          gasPrice: parseInt(trade.summary.gasPrice),
        }

        return provider
          .getSigner()
          .sendTransaction(txWithGas)
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error(t`Transaction rejected`)
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error)

              if (error instanceof InvalidSwapError) {
                throw error
              } else {
                throw new Error(t`Swap failed: ${swapErrorToUserReadableMessage(error)}`)
              }
            }
          })
      },
    }
  }, [
    account,
    chainId,
    provider,
    trade,
    deadline,
    isLoadingKyberswap,
    mutateConfirm,
    resetMutationCache,
    slippageTolerance,
  ])
}
// returns a function that will execute a swap, if the parameters are all valid
export function useSendParaswapTransaction(
  account: string | null | undefined,
  chainId: number | undefined,
  provider: JsonRpcProvider | undefined,
  trade: ParaswapTrade | undefined, // trade to execute, required
  deadline: BigNumber | undefined
): {
  callback: null | (() => Promise<TransactionResponse>)
  isLoading: boolean
} {
  const slippageTolerance = formatPercentInBasisPointsNumber(
    useUserSlippageToleranceWithDefault(DEFAULT_KYBERSWAP_SLIPPAGE_TOLERANCE)
  )

  const [mutateConfirm, { isLoading: isLoading, reset: resetMutationCache }] = useParaswapConfirmSwapMutation()

  return useMemo(() => {
    if (!trade || !provider || !account || !chainId) {
      return { callback: null, isLoading: false }
    }
    return {
      isLoading,
      callback: async function onSwap(): Promise<TransactionResponse> {
        resetMutationCache()
        const args: BuildSwapTxInput & { chainId: ChainId } = {
          slippage: slippageTolerance,
          deadline: deadline?.toString(),
          srcToken: trade.data.srcToken,
          destToken: trade.data.destToken,
          priceRoute: trade.data,
          userAddress: account,
          chainId,
          ...(trade.tradeType === TradeType.EXACT_INPUT
            ? { srcAmount: trade.data.srcAmount }
            : { destAmount: trade.data.destAmount }),
          // partner: referrer,
        }

        const d = await mutateConfirm(args)

        const { data: txParams } = d as { data: TransactionParams }

        const signer = provider.getSigner()
        // const signerAddress = await signer.getAddress()

        const tx = {
          data: txParams.data,
          to: txParams.to,
          from: txParams.from,
          value: txParams.value,
        }

        const gasLimit = await await signer
          .estimateGas(tx)
          .then(calculateGasMargin)
          .catch(() => calculateGasMargin(BigNumber.from(5_000_000)))

        const txWithGas: Parameters<typeof signer.sendTransaction>[0] = {
          ...tx,
          gasLimit,
          gasPrice: txParams.gasPrice,
        }
        // console.log({ args, txParams, tx, gasLimit, txWithGas })
        // debugger

        return provider
          .getSigner()
          .sendTransaction(txWithGas)
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error(t`Transaction rejected`)
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error)

              if (error instanceof InvalidSwapError) {
                throw error
              } else {
                throw new Error(t`Swap failed: ${swapErrorToUserReadableMessage(error)}`)
              }
            }
          })
      },
    }
  }, [account, chainId, provider, trade, deadline, isLoading, mutateConfirm, resetMutationCache, slippageTolerance])
}
