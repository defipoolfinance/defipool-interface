import { Trans } from '@lingui/macro'
import { Percent } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import SettingsTab from 'components/Settings'
import { ReactNode } from 'react'
import { ArrowLeft } from 'react-feather'
import { Link, useNavigate } from 'react-router-dom'
import { Box } from 'rebass'
import { useAppDispatch } from 'state/hooks'
import { resetMintState } from 'state/mint/actions'
import { resetMintState as resetMintV3State } from 'state/mint/v3/actions'
import styled, { useTheme } from 'styled-components'
import { ThemedText } from 'theme/components'
import { flexRowNoWrap } from 'theme/styles'

import { RowBetween } from '../Row'

const Tabs = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const StyledLink = styled(Link)<{ flex?: string }>`
  flex: ${({ flex }) => flex ?? 'none'};
  display: flex;
  align-items: center;
  width: fit-content;

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    flex: none;
    margin-right: 10px;
  `};
`

const FindPoolTabsText = styled(ThemedText.H1Small)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.neutral1};
  border-radius: 32px;
  width: 40px;
  max-width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.accent7};
  padding: 8px;
`

export function FindPoolTabs({ origin }: { origin: string }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 1rem 0 1rem', position: 'relative' }}>
        <Link to={origin}>
          <StyledArrowLeft />
        </Link>
        <FindPoolTabsText>
          <Trans>Import V2 pool</Trans>
        </FindPoolTabsText>
      </RowBetween>
    </Tabs>
  )
}

const SettingsTabRightWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 10px;
`
const AddRemoveTitleText = styled(ThemedText.H1Small)<{ $center: boolean }>`
  margin: auto;
  width: 100%;
  text-align: ${({ $center }) => ($center ? 'center' : 'center')};
  font-family: Inter;
  font-size: 25px;
  font-style: normal;
  font-weight: 500;
  line-height: 40px;
`

export function AddRemoveTabs({
  adding,
  creating,
  autoSlippage,
  children,
}: {
  adding: boolean
  creating: boolean
  autoSlippage: Percent
  showBackLink?: boolean
  children?: ReactNode
}) {
  const { chainId } = useWeb3React()
  const theme = useTheme()
  // reset states on back
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 1rem 0 1rem' }} align="center">
        <StyledLink
          to=".."
          onClick={(e) => {
            e.preventDefault()
            navigate(-1)

            if (adding) {
              // not 100% sure both of these are needed
              dispatch(resetMintState())
              dispatch(resetMintV3State())
            }
          }}
          flex={children ? '1' : undefined}
        >
          <StyledArrowLeft stroke={theme.neutral2} />
        </StyledLink>
        <AddRemoveTitleText $center={!children}>
          {creating ? (
            <Trans>Create a pair</Trans>
          ) : adding ? (
            <Trans>Add liquidity</Trans>
          ) : (
            <Trans>Remove liquidity</Trans>
          )}
        </AddRemoveTitleText>
        <SettingsTabRightWrapper>
          {children && <Box style={{ marginRight: '.5rem' }}>{children}</Box>}
          <SettingsTab autoSlippage={autoSlippage} chainId={chainId} hideRoutingSettings />
        </SettingsTabRightWrapper>
      </RowBetween>
    </Tabs>
  )
}
