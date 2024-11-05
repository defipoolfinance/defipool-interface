// eslint-disable-next-line no-restricted-imports
import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { Percent } from '@uniswap/sdk-core'
import { FeeOptions } from '@uniswap/v3-sdk'
import { useWeb3React } from '@web3-react/core'
import useENS from 'hooks/useENS'
import { SignatureData } from 'hooks/useERC20Permit'
import { useSwapCallArguments } from 'hooks/useSwapCallArguments'
import { ReactNode, useMemo } from 'react'

import { KyberswapSupportedChainId } from 'rest/kyberswap/types-kyberswap'
import { ParaswapSupportedChainId } from 'rest/paraswap/api-paraswap'
import { ClassicTrade, KyberswapTrade, ParaswapTrade } from 'state/routing/types'
import useSendSwapTransaction, {
  useSendKyberswapTransaction,
  useSendParaswapTransaction,
} from './useSendSwapTransaction'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface UseSwapCallbackReturns {
  state: SwapCallbackState
  callback?: () => Promise<TransactionResponse>
  error?: ReactNode

  /**
   * Only for kyberswap response
   */
  // encodedData?: TGetEncodedDataResponse['data']
}
interface UseSwapCallbackArgs<T> {
  trade?: T // Trade<Currency, Currency, TradeType> | undefined // trade to execute, required
  allowedSlippage: Percent // in bips
  recipientAddressOrName?: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData?: SignatureData | null
  deadline?: BigNumber
  feeOptions?: FeeOptions
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useLibSwapCallBack({
  trade,
  allowedSlippage,
  recipientAddressOrName,
  signatureData,
  deadline,
  feeOptions,
}: UseSwapCallbackArgs<ClassicTrade>): () => UseSwapCallbackReturns {
  const { account, chainId, provider } = useWeb3React()

  const swapCalls = useSwapCallArguments(
    trade,
    allowedSlippage,
    recipientAddressOrName,
    signatureData,
    deadline,
    feeOptions
  )
  const { callback } = useSendSwapTransaction(account, chainId, provider, trade, swapCalls)

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!trade || !provider || !account || !chainId || !callback) {
      return () => ({ state: SwapCallbackState.INVALID, error: <Trans>Missing dependencies</Trans> })
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return () => ({ state: SwapCallbackState.INVALID, error: <Trans>Invalid recipient</Trans> })
      } else {
        return () => ({ state: SwapCallbackState.LOADING })
      }
    }

    return () => ({
      state: SwapCallbackState.VALID,
      callback: async () => callback(),
    })
  }, [trade, provider, account, chainId, callback, recipient, recipientAddressOrName])
}

export function useKyberswapCallback({
  // signatureData,
  deadline,
  // feeOptions,
  trade,
  // eslint-disable-next-line
  allowedSlippage,
}: UseSwapCallbackArgs<KyberswapTrade>): () => UseSwapCallbackReturns {
  const { account, chainId, provider } = useWeb3React()

  // if (!account || !chainId || !provider) {
  //   throw new Error('Must be here')
  // }

  const { callback, isLoadingKyberswap } = useSendKyberswapTransaction(
    account,
    chainId as KyberswapSupportedChainId,
    provider,
    trade, // trade to execute, required
    deadline
  )

  return useMemo(() => {
    // console.log({
    //   trade,
    //   provider,
    //   account,
    //   chainId,
    //   callback,
    //   recipient: args.recipient,
    //   isLoadingKyberswap,
    //   errorKyberswap,
    //   dataKyberswap,
    //   options,
    //   args,
    // })
    // debugger

    if (!trade || !provider || !account || !chainId || !callback) {
      return () => ({ state: SwapCallbackState.INVALID, error: <Trans>Missing dependencies</Trans> })
    }

    // if (!account) {
    //   if (recipientAddressOrName !== null) {
    //     return () => ({ state: SwapCallbackState.INVALID, error: <Trans>Invalid recipient</Trans> })
    //   } else {
    //     return () => ({ state: SwapCallbackState.LOADING })
    //   }
    // }

    if (isLoadingKyberswap) {
      return () => ({ state: SwapCallbackState.LOADING })
    }

    // if (errorKyberswap || !dataKyberswap) {
    //   return () => ({ state: SwapCallbackState.INVALID, error: <Trans>Invalid swap confirmation</Trans> })
    // }

    return () => ({
      state: SwapCallbackState.VALID,
      callback: async () => callback(),
      // encodedData: dataKyberswap.data,
    })
  }, [
    trade,
    provider,
    account,
    chainId,
    // args,
    callback,
    // mutateConfirm,
    // dataKyberswap,
    // errorKyberswap,
    isLoadingKyberswap,
  ])
}

export function useParaswapCallback({
  // signatureData,
  deadline,
  // feeOptions,
  trade,
  // eslint-disable-next-line
  allowedSlippage,
}: UseSwapCallbackArgs<ParaswapTrade>): () => UseSwapCallbackReturns {
  const { account, chainId, provider } = useWeb3React()

  const { callback, isLoading } = useSendParaswapTransaction(
    account,
    chainId as ParaswapSupportedChainId,
    provider,
    trade, // trade to execute, required
    deadline
  )

  return useMemo(() => {
    if (!trade || !provider || !account || !chainId || !callback) {
      return () => ({ state: SwapCallbackState.INVALID, error: <Trans>Missing dependencies</Trans> })
    }

    if (isLoading) {
      return () => ({ state: SwapCallbackState.LOADING })
    }

    return () => ({
      state: SwapCallbackState.VALID,
      callback: async () => callback(),
      // encodedData: dataKyberswap.data,
    })
  }, [
    trade,
    provider,
    account,
    chainId,
    // args,
    callback,
    // mutateConfirm,
    // dataKyberswap,
    // errorKyberswap,
    isLoading,
  ])
}
