import RouterLabel from '.'
import { TEST_DUTCH_TRADE_ETH_INPUT, TEST_TRADE_EXACT_INPUT } from '../../test-utils/constants'
import { render, screen } from '../../test-utils/render'

describe('RouterLabel', () => {
  it('renders correct label for UniswapX trade', () => {
    render(<RouterLabel trade={TEST_DUTCH_TRADE_ETH_INPUT} />)
    expect(screen.getByText('DeFi Pool X')).toBeInTheDocument()
  })

  it('renders correct label for classic trade with client routing', () => {
    render(<RouterLabel trade={TEST_TRADE_EXACT_INPUT} />)
    expect(screen.getByText('DeFi Pool Client')).toBeInTheDocument()
  })
})
