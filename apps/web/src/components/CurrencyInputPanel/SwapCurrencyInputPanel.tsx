import { Trans } from '@lingui/macro'
import { BrowserEvent, InterfaceElementName, SwapEventName } from '@uniswap/analytics-events'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import { useWeb3React } from '@web3-react/core'
import { TraceEvent } from 'analytics'
import { AutoColumn } from 'components/Column'
import { LoadingOpacityContainer } from 'components/Loader/styled'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { StyledNumericalInput } from 'components/NumericalInput'
import PrefetchBalancesWrapper from 'components/PrefetchBalancesWrapper/PrefetchBalancesWrapper'
import Tooltip from 'components/Tooltip'
import { isSupportedChain } from 'constants/chains'
import ms from 'ms'
import { darken } from 'polished'
import { ReactNode, forwardRef, useCallback, useEffect, useState } from 'react'
import { Lock } from 'react-feather'
import styled, { useTheme } from 'styled-components'
import { ThemedText } from 'theme/components'
import { flexColumnNoWrap, flexRowNoWrap } from 'theme/styles'
import { NumberType, useFormatter } from 'utils/formatNumbers'

import { CurrencySearchFilters } from 'components/SearchModal/CurrencySearch'
import { Text } from 'ui/src'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { useCurrencyBalance } from '../../state/connection/hooks'
import { ButtonGray } from '../Button'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { FiatValue } from './FiatValue'
import { formatCurrencySymbol } from './utils'

export const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${flexColumnNoWrap};
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '16px' : '20px')};
  z-index: 1;
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  transition: height 1s ease;
  will-change: height;
`

const FixedContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`

const Container = styled.div<{ hideInput: boolean }>`
  min-height: 44px;
  border-radius: ${({ hideInput }) => (hideInput ? '16px' : '20px')};
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
`

export const CurrencySelect = styled(ButtonGray)<{
  visible: boolean
  selected: boolean
  hideInput?: boolean
  disabled?: boolean
  animateShake?: boolean
  background?: string
}>`
  align-items: center;
  background-color: ${({ selected, theme, background }) =>
    selected ? (background ? background : theme.neutral1) : theme.accent4};
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  color: ${({ selected, theme }) => (selected ? theme.surface2 : theme.neutralContrast)};
  cursor: pointer;
  //36px;
  height: ${({ selected }) => (selected ? '56px' : '36px')};
  border-radius: ${({ selected }) => (selected ? '10px' : '90px')};
  outline: none;
  user-select: none;

  border: 0.5px solid #494b53;
  font-size: 24px;
  font-weight: 485;
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  // padding: ${({ selected }) => (selected ? '22px 16px 22px 16px' : '22px 20px 22px 20px')};
  padding: ${({ selected }) => (selected ? '15.763px 12px 16.237px 12px;' : '22px 20px 22px 20px')};
  gap: 8px;
  justify-content: space-between;
  margin-left: ${({ hideInput }) => (hideInput ? '0' : '12px')};
  // box-shadow: ${({ theme }) => theme.deprecated_shallowShadow};

  &:hover,
  &:active {
    background-color: ${({ theme, selected }) => (selected ? theme.surface3 : theme.accent4)};
  }

  &:before {
    background-size: 100%;
    border-radius: inherit;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    content: '';
  }

  &:hover:before {
    background-color: ${({ theme }) => theme.deprecated_stateOverlayHover};
  }

  &:active:before {
    background-color: ${({ theme }) => theme.deprecated_stateOverlayPressed};
  }

  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};

  @keyframes horizontal-shaking {
    0% {
      transform: translateX(0);
      animation-timing-function: ease-in-out;
    }
    20% {
      transform: translateX(10px);
      animation-timing-function: ease-in-out;
    }
    40% {
      transform: translateX(-10px);
      animation-timing-function: ease-in-out;
    }
    60% {
      transform: translateX(10px);
      animation-timing-function: ease-in-out;
    }
    80% {
      transform: translateX(-10px);
      animation-timing-function: ease-in-out;
    }
    100% {
      transform: translateX(0);
      animation-timing-function: ease-in-out;
    }
  }
  animation: ${({ animateShake }) => (animateShake ? 'horizontal-shaking 300ms' : 'none')};
`

const InputRow = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: space-between;
  min-height: 55px;
`

const LabelRow = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  color: ${({ theme }) => theme.neutral2};
  font-size: 0.75rem;
  line-height: 1rem;

  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.neutral2)};
  }
`

const FiatRow = styled(LabelRow)`
  justify-content: flex-end;
  min-height: 24px;
  padding: 4px 0 0 0;
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean; color?: string }>`
  margin: 0 0.25rem 0 0.35rem;
  height: 35%;
  margin-left: 8px;

  path {
    stroke: ${({ selected, theme, color }) => (color ? color : selected ? theme.surface2 : theme.neutralContrast)};
    stroke-width: 2px;
  }
`

const StyledTokenName = styled.span<{ active?: boolean; color?: string; fontSize?: string; fontWeight?: string }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.25rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  color: ${({ theme, color }) => (color ? color : theme.neutralContrast)};
  //font-size: 20px;
  //font-weight: 535;
  //font-size: 14px;
  //font-weight: 400;
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
`

const StyledBalanceMax = styled.button<{ disabled?: boolean }>`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.neutral1};
  cursor: pointer;
  font-size: 14px;
  font-weight: 535;
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  padding: 4px 6px;
  pointer-events: ${({ disabled }) => (!disabled ? 'initial' : 'none')};

  :hover {
    opacity: ${({ disabled }) => (!disabled ? 0.8 : 0.4)};
  }

  :focus {
    outline: none;
  }
`

interface SwapCurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label: ReactNode
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  fiatValue?: { data?: number; isLoading: boolean }
  priceImpact?: Percent
  id: string
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
  locked?: boolean
  loading?: boolean
  disabled?: boolean
  currencySearchFilters?: CurrencySearchFilters
  numericalInputSettings?: {
    disabled?: boolean
    onDisabledClick?: () => void
    disabledTooltipBody?: ReactNode
  }
  isLandingPage: boolean
  disabledInput?: boolean
}

const SwapCurrencyInputPanel = forwardRef<HTMLInputElement, SwapCurrencyInputPanelProps>(
  (
    {
      value,
      onUserInput,
      onMax,
      showMaxButton,
      onCurrencySelect,
      currency,
      otherCurrency,
      id,
      renderBalance,
      fiatValue,
      priceImpact,
      hideBalance = false,
      pair = null, // used for double token logo
      hideInput = false,
      locked = false,
      loading = false,
      disabled = false,
      currencySearchFilters,
      numericalInputSettings,
      label,
      isLandingPage,
      disabledInput = false,
      ...rest
    },
    ref
  ) => {
    const [modalOpen, setModalOpen] = useState(false)
    const { account, chainId } = useWeb3React()
    const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
    const theme = useTheme()
    const { formatCurrencyAmount } = useFormatter()

    const handleDismissSearch = useCallback(() => {
      setModalOpen(false)
    }, [setModalOpen])

    const [tooltipVisible, setTooltipVisible] = useState(false)
    const handleDisabledNumericalInputClick = useCallback(() => {
      if (numericalInputSettings?.disabled && !tooltipVisible) {
        setTooltipVisible(true)
        setTimeout(() => setTooltipVisible(false), ms('4s')) // reset shake animation state after 4s
        numericalInputSettings.onDisabledClick?.()
      }
    }, [tooltipVisible, numericalInputSettings])

    const chainAllowed = isSupportedChain(chainId)

    // reset tooltip state when currency changes
    useEffect(() => setTooltipVisible(false), [currency])

    return (
      <InputPanel id={id} hideInput={hideInput} {...rest}>
        {locked && (
          <FixedContainer>
            <AutoColumn gap="sm" justify="center">
              <Lock />
              <Text variant="body2" textAlign="center" px="$spacing12">
                <Trans>The market price is outside your specified price range. Single-asset deposit only.</Trans>
              </Text>
            </AutoColumn>
          </FixedContainer>
        )}

        <Container hideInput={hideInput}>
          <Text color={!isLandingPage ? '$neutral2' : '$surface2'} variant="subheading2" userSelect="none">
            {label}
          </Text>
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}>
            {!hideInput && (
              <div
                style={{
                  display: 'flex',
                  flexGrow: 1,
                  cursor:
                    !chainAllowed || disabled || numericalInputSettings?.disabled || disabledInput
                      ? 'not-allowed'
                      : 'text',
                }}
                onClick={handleDisabledNumericalInputClick}
              >
                <StyledNumericalInput
                  color={!isLandingPage ? '#fff' : '#080809'}
                  className="token-amount-input"
                  value={value}
                  onUserInput={onUserInput}
                  disabled={!chainAllowed || disabled || numericalInputSettings?.disabled || disabledInput}
                  $loading={loading}
                  id={id}
                  ref={ref}
                  maxDecimals={currency?.decimals}
                />
              </div>
            )}
            <PrefetchBalancesWrapper shouldFetchOnAccountUpdate={modalOpen}>
              <Tooltip
                show={tooltipVisible && !modalOpen}
                placement="bottom"
                offsetY={14}
                text={numericalInputSettings?.disabledTooltipBody}
              >
                <CurrencySelect
                  style={{
                    marginTop: isLandingPage ? '-12px' : '0px',
                  }}
                  background="transparent"
                  disabled={!chainAllowed || disabled}
                  visible={currency !== undefined}
                  selected={!!currency}
                  hideInput={hideInput}
                  className="open-currency-select-button"
                  onClick={() => {
                    if (onCurrencySelect) {
                      setModalOpen(true)
                    }
                  }}
                  animateShake={tooltipVisible}
                >
                  <Aligner>
                    <RowFixed>
                      {pair ? (
                        <span style={{ marginRight: '0.5rem' }}>
                          <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
                        </span>
                      ) : currency ? (
                        <CurrencyLogo style={{ marginRight: '8px' }} currency={currency} size="32px" />
                      ) : null}
                      {pair ? (
                        <StyledTokenName
                          color={(isLandingPage && !currency) || !currency ? '#fff' : '#080809'}
                          className="pair-name-container"
                        >
                          {pair?.token0.symbol}:{pair?.token1.symbol}
                        </StyledTokenName>
                      ) : (
                        <StyledTokenName
                          fontWeight={currency ? '400' : '535'}
                          fontSize={currency ? '14px' : '20px'}
                          color={isLandingPage && currency ? '#080809' : !isLandingPage && currency ? '#fff' : '#fff'}
                          className="token-symbol-container"
                          active={Boolean(currency && currency.symbol)}
                        >
                          {currency ? formatCurrencySymbol(currency) : <Trans>Select token</Trans>}
                        </StyledTokenName>
                      )}
                    </RowFixed>
                    {onCurrencySelect && (
                      <StyledDropDown
                        color={isLandingPage && currency ? '#080809' : !isLandingPage && currency ? '#fff' : '#fff'}
                        selected={!!currency}
                      />
                    )}
                  </Aligner>
                </CurrencySelect>
              </Tooltip>
            </PrefetchBalancesWrapper>
          </InputRow>
          {!isLandingPage && Boolean(!hideInput && !hideBalance) && (
            <FiatRow>
              <RowBetween>
                <LoadingOpacityContainer $loading={loading}>
                  {fiatValue && (
                    <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} testId={`fiat-value-${id}`} />
                  )}
                </LoadingOpacityContainer>
                {account ? (
                  <RowFixed style={{ height: '16px' }}>
                    <ThemedText.DeprecatedBody
                      data-testid="balance-text"
                      color={theme.neutral1}
                      fontWeight={485}
                      fontSize={14}
                      style={{ display: 'inline' }}
                    >
                      {!hideBalance && currency && selectedCurrencyBalance ? (
                        renderBalance ? (
                          renderBalance(selectedCurrencyBalance)
                        ) : (
                          <Trans>
                            Balance:{' '}
                            {formatCurrencyAmount({
                              amount: selectedCurrencyBalance,
                              type: NumberType.TokenNonTx,
                            })}
                          </Trans>
                        )
                      ) : null}
                    </ThemedText.DeprecatedBody>
                    {showMaxButton && selectedCurrencyBalance ? (
                      <TraceEvent
                        events={[BrowserEvent.onClick]}
                        name={SwapEventName.SWAP_MAX_TOKEN_AMOUNT_SELECTED}
                        element={InterfaceElementName.MAX_TOKEN_AMOUNT_BUTTON}
                      >
                        <StyledBalanceMax onClick={onMax}>
                          <Trans>Max</Trans>
                        </StyledBalanceMax>
                      </TraceEvent>
                    ) : null}
                  </RowFixed>
                ) : (
                  <span />
                )}
              </RowBetween>
            </FiatRow>
          )}
        </Container>
        {onCurrencySelect && (
          <CurrencySearchModal
            isOpen={modalOpen}
            onDismiss={handleDismissSearch}
            onCurrencySelect={onCurrencySelect}
            selectedCurrency={currency}
            otherSelectedCurrency={otherCurrency}
            currencySearchFilters={currencySearchFilters}
            maxWidth={576}
          />
        )}
      </InputPanel>
    )
  }
)
SwapCurrencyInputPanel.displayName = 'SwapCurrencyInputPanel'

export default SwapCurrencyInputPanel
