import { Trade } from '@uniswap/router-sdk'
import { Currency, CurrencyAmount, Percent, SWAP_ROUTER_02_ADDRESSES, Token, TradeType } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'

import { useApproval } from '../useApproval'

// wraps useApproveCallback in the context of a swap
// eslint-disable-next-line
export default function useSwapApproval(
  trade: Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: Percent,
  useIsPendingApproval: (token?: Token, spender?: string) => boolean,
  amount?: CurrencyAmount<Currency> // defaults to trade.maximumAmountIn(allowedSlippage)
) {
  const { chainId } = useWeb3React()

  const amountToApprove = useMemo(() => {
    return amount || (trade && trade.inputAmount.currency.isToken ? trade.maximumAmountIn(allowedSlippage) : undefined)
  }, [amount, trade, allowedSlippage])
  const spender = chainId ? SWAP_ROUTER_02_ADDRESSES(chainId) : undefined
  if (!spender) throw new Error('The swapRouter02Address contract address is not specified for this chain in sdk-core')
  return useApproval(amountToApprove, spender, useIsPendingApproval)
}
