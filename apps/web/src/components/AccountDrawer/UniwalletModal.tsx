import { Trans } from '@lingui/macro'
import { InterfaceElementName, InterfaceEventName } from '@uniswap/analytics-events'
import { WalletConnect as WalletConnectv2 } from '@web3-react/walletconnect-v2'
import { sendAnalyticsEvent } from 'analytics'
import Column, { AutoColumn } from 'components/Column'
import Modal from 'components/Modal'
import { RowBetween } from 'components/Row'
import { uniwalletWCV2ConnectConnection } from 'connection'
import { ActivationStatus, useActivationState } from 'connection/activate'
import { ConnectionType } from 'connection/types'
import { UniwalletConnect as UniwalletConnectV2 } from 'connection/WalletConnectV2'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { CloseIcon, ThemedText } from 'theme/components'
import { isAndroid, isIOS } from 'utils/platform'

import uniPng from '../../assets/images/uniwallet_modal_icon.png'
import { DownloadButton } from './DownloadButton'

const UniwalletConnectWrapper = styled(RowBetween)`
  display: flex;
  flex-direction: column;
  padding: 20px 16px 16px;
`
const HeaderRow = styled(RowBetween)`
  display: flex;
`
const QRCodeWrapper = styled(RowBetween)`
  aspect-ratio: 1;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.white};
  margin: 24px 32px 20px;
  padding: 10px;
`
const Divider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.surface3};
  width: 100%;
`

export default function UniwalletModal() {
  const { activationState, cancelActivation } = useActivationState()
  const [uri, setUri] = useState<string>()

  // Displays the modal if not on iOS/Android, a DeFi Pool Wallet Connection is pending, & qrcode URI is available
  const onLaunchedMobilePlatform = isIOS || isAndroid
  const open =
    !onLaunchedMobilePlatform &&
    activationState.status === ActivationStatus.PENDING &&
    activationState.connection.type === ConnectionType.UNISWAP_WALLET_V2 &&
    !!uri

  useEffect(() => {
    const connectorV2 = uniwalletWCV2ConnectConnection.connector as WalletConnectv2
    connectorV2.events.addListener(UniwalletConnectV2.UNI_URI_AVAILABLE, (uri: string) => {
      uri && setUri(uri)
    })
  }, [])

  useEffect(() => {
    if (open) sendAnalyticsEvent(InterfaceEventName.UNIWALLET_CONNECT_MODAL_OPENED)
  }, [open])

  const theme = useTheme()
  return (
    <Modal isOpen={open} onDismiss={cancelActivation}>
      <UniwalletConnectWrapper>
        <HeaderRow>
          <ThemedText.SubHeader>
            <Trans>Scan with DeFi Pool Wallet</Trans>
          </ThemedText.SubHeader>
          <CloseIcon onClick={cancelActivation} />
        </HeaderRow>
        <QRCodeWrapper>
          {uri && (
            <QRCodeSVG
              value={uri}
              width="100%"
              height="100%"
              level="M"
              fgColor={theme.darkMode ? theme.surface1 : theme.black}
              imageSettings={{
                src: uniPng,
                height: 33,
                width: 33,
                excavate: false,
              }}
            />
          )}
        </QRCodeWrapper>
        <Divider />
        <InfoSection />
      </UniwalletConnectWrapper>
    </Modal>
  )
}

const InfoSectionWrapper = styled(RowBetween)`
  display: flex;
  flex-direction: row;
  padding-top: 20px;
  gap: 20px;
`

function InfoSection() {
  const showOld = false
  return (
    <InfoSectionWrapper>
      <AutoColumn gap="4px">
        <ThemedText.SubHeaderSmall color="neutral1">
          <Trans>Don&apos;t have a DeFi Pool wallet?</Trans>
        </ThemedText.SubHeaderSmall>
        <ThemedText.BodySmall color="neutral2">
          <Trans>Safely store and swap tokens with the DeFi Pool app. Available on iOS and Android.</Trans>
        </ThemedText.BodySmall>
      </AutoColumn>
      {showOld ? (
        <Column>
          <DownloadButton element={InterfaceElementName.UNISWAP_WALLET_MODAL_DOWNLOAD_BUTTON} />
        </Column>
      ) : null}
    </InfoSectionWrapper>
  )
}
