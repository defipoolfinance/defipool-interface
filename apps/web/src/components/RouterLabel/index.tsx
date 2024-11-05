import { QuoteMethod, SubmittableTrade, TradeFillType } from 'state/routing/types'
import { isUniswapXTrade } from 'state/routing/utils'
import { DefaultTheme } from 'styled-components'
import { ThemedText } from 'theme/components'

import UniswapXRouterLabel from './UniswapXRouterLabel'

export default function RouterLabel({ trade, color }: { trade: SubmittableTrade; color?: keyof DefaultTheme }) {
  if (isUniswapXTrade(trade)) {
    return (
      <UniswapXRouterLabel>
        <ThemedText.BodySmall>DeFi Pool X</ThemedText.BodySmall>
      </UniswapXRouterLabel>
    )
  }

  if (trade.quoteMethod === QuoteMethod.CLIENT_SIDE_FALLBACK) {
    return <ThemedText.BodySmall color={color}>DeFi Pool Client</ThemedText.BodySmall>
  }

  if (trade.fillType === TradeFillType.Kyberswap) {
    return <ThemedText.BodySmall color={color}>Kyberswap</ThemedText.BodySmall>
  }

  if (trade.fillType === TradeFillType.Paraswap) {
    return <ThemedText.BodySmall color={color}>Paraswap</ThemedText.BodySmall>
  }

  return <ThemedText.BodySmall color={color}>DeFi Pool Trade</ThemedText.BodySmall>
}
