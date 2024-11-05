import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import IconButton from 'components/AccountDrawer/IconButton'
import { useShowMoonpayText } from 'components/AccountDrawer/MiniPortfolio/hooks'
import Column from 'components/Column'
import { Settings } from 'components/Icons/Settings'
import Row, { AutoRow } from 'components/Row'
import { deprecatedNetworkConnection, networkConnection } from 'connection'
import { ActivationStatus, useActivationState } from 'connection/activate'
import { isSupportedChain } from 'constants/chains'
import { useEffect } from 'react'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'
import { flexColumnNoWrap } from 'theme/styles'
import { FeatureFlags } from 'uniswap/src/features/experiments/flags'
import { useFeatureFlag } from 'uniswap/src/features/experiments/hooks'
import ConnectionErrorView from './ConnectionErrorView'
import { DeprecatedInjectorMessage } from './Option'
import PrivacyPolicyNotice from './PrivacyPolicyNotice'
import { useOrderedConnections } from './useOrderedConnections'

const Wrapper = styled.div`
  ${flexColumnNoWrap};
  background-color: ${({ theme }) => theme.surface1};
  width: 100%;
  padding: 14px 16px 16px;
  flex: 1;
  background-color: ${({ theme }) => theme.surface6};
`

const OptionGrid = styled.div`
  display: grid;
  flex: 1;
  grid-gap: 16px;
  border-radius: 10px;
  overflow: hidden;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    grid-template-columns: 1fr;
  `};
`
const Heading = styled.h3`
  color: ${({ theme }) => theme.neutral1};
  font-size: 32px;
  font-weight: 500;
  line-height: 40px;
  letter-spacing: -0.01em;
`
const TextSectionWrapper = styled.div`
  padding: 0 4px;
`

const Line = styled.hr`
  width: 100%;
  border-color: ${({ theme }) => theme.surface3};
`

export default function WalletModal({ openSettings }: { openSettings: () => void }) {
  const { connector, chainId } = useWeb3React()
  const showMoonpayText = useShowMoonpayText()

  const { activationState } = useActivationState()
  const fallbackProviderEnabled = useFeatureFlag(FeatureFlags.FallbackProvider)
  // Keep the network connector in sync with any active user connector to prevent chain-switching on wallet disconnection.
  useEffect(() => {
    if (chainId && isSupportedChain(chainId) && connector !== networkConnection.connector) {
      if (fallbackProviderEnabled) {
        networkConnection.connector.activate(chainId)
      } else {
        deprecatedNetworkConnection.connector.activate(chainId)
      }
    }
  }, [chainId, connector, fallbackProviderEnabled])

  const { orderedConnections, showDeprecatedMessage } = useOrderedConnections()

  const showDeprecated = false
  return (
    <Wrapper data-testid="wallet-modal">
      <AutoRow justify="space-between" width="100%" marginBottom="16px">
        <Heading>Connect a wallet</Heading>
        <IconButton Icon={Settings} onClick={openSettings} data-testid="wallet-settings" />
      </AutoRow>
      {activationState.status === ActivationStatus.ERROR ? (
        <ConnectionErrorView />
      ) : (
        <Column gap="md" flex="1">
          <Row flex="1" align="flex-start">
            <OptionGrid data-testid="option-grid">{orderedConnections}</OptionGrid>
          </Row>
          {showDeprecatedMessage && (
            <TextSectionWrapper>
              <DeprecatedInjectorMessage />
            </TextSectionWrapper>
          )}
          <Column gap="md">
            {showDeprecated ? (
              <TextSectionWrapper>
                <PrivacyPolicyNotice />
              </TextSectionWrapper>
            ) : null}

            {showMoonpayText && (
              <>
                <Line />
                <TextSectionWrapper>
                  <ThemedText.Caption color="neutral3">
                    <Trans>Fiat onramp powered by MoonPay USA LLC</Trans>
                  </ThemedText.Caption>
                </TextSectionWrapper>
              </>
            )}
          </Column>
        </Column>
      )}
    </Wrapper>
  )
}
