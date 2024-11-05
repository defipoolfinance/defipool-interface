import { Trans } from '@lingui/macro'
import { useScreenSize } from 'hooks/useScreenSize'
import { Link } from 'react-router-dom'
import { useTogglePrivacyPolicy } from 'state/application/hooks'
import styled, { css } from 'styled-components'
import { ExternalLink } from 'theme/components'

import { showDeprecated } from '../../../utils/showDeprecated'
import { Body1, Box } from '../components/Generics'
import { Facebook, Instagram, Twitter } from '../components/Icons'
import { Wiggle } from '../components/animations'

const SocialIcon = styled(Wiggle)`
  flex: 0;
  fill: ${(props) => props.theme.neutral1};
  cursor: pointer;
  transition: fill;
  transition-duration: 0.2s;

  &:hover {
    fill: ${(props) => props.$hoverColor};
  }
`
const RowToCol = styled(Box)`
  height: auto;
  flex-shrink: 1;
  @media (max-width: 768px) {
    flex-direction: column;
    flex-wrap: wrap;
  }
`
const HideWhenSmall = styled(Box)`
  @media (max-width: 768px) {
    display: none;
  }
`
const Reserved = styled(Box)`
  margin-top: 20px;
  color: #b4b4b4;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
`
const HideWhenLarge = styled(Box)`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    display: none;
  }
`
const MenuItemStyles = css`
  padding: 0;
  margin: 0;
  text-align: left;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.neutral2};
  stroke: none;
  transition: color 0.1s ease-in-out;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.neutral1};
    opacity: 1;
  }
`
const StyledInternalLink = styled(Link)`
  ${MenuItemStyles}
`
const StyledExternalLink = styled(ExternalLink)`
  ${MenuItemStyles}
`
const ModalItem = styled.div`
  ${MenuItemStyles};
  cursor: pointer;
  user-select: none;
`

export function Socials({ iconSize = '50' }: { iconSize?: string }) {
  return (
    <Box gap="10px" style={{ margin: '20px 0 0 -14px' }}>
      <SocialIcon $hoverColor="#20BAFF">
        <StyledExternalLink href="#">
          <Facebook size={iconSize} fill="inherit" />
        </StyledExternalLink>
      </SocialIcon>
      <SocialIcon $hoverColor="#FF5F5F">
        <StyledExternalLink href="#">
          <Instagram size={iconSize} fill="inherit" />
        </StyledExternalLink>
      </SocialIcon>
      <SocialIcon $hoverColor="#5F51FF">
        <StyledExternalLink href="#">
          <Twitter size={iconSize} fill="inherit" />
        </StyledExternalLink>
      </SocialIcon>
    </Box>
  )
}

export function Footer() {
  const screenIsLarge = useScreenSize()['lg']
  const screenIsPhone = useScreenSize()['xsl']
  const togglePrivacyPolicy = useTogglePrivacyPolicy()

  return (
    <Box as="footer" direction="column" align="flex-start" maxWidth="93vw">
      <Box direction="row" gap={screenIsLarge ? '32px' : '0'} width={screenIsLarge ? '100%' : '100%'}>
        <RowToCol direction="row" justify-content="space-between" gap="32px" width={screenIsLarge ? '100%' : '100%'}>
          <Box direction="column" height="100%" gap="64px">
            <Box direction="column" gap="10px">
              <svg width="161" height="31" viewBox="0 0 161 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.2267 4.27417H0V0H15.2267C23.6362 0 30.4534 6.81723 30.4534 15.2267C30.4534 23.6362 23.6362 30.4534 15.2267 30.4534H0V28.6134V26.1793V17.5776V13.3603V13.2993L17.1788 13.2993V17.5776H4.2783V26.1793H15.2267C21.2756 26.1793 26.1793 21.2756 26.1793 15.2267C26.1793 9.17779 21.2756 4.27417 15.2267 4.27417Z"
                  fill="#1324EE"
                />
                <path
                  d="M50.6945 23.7267H44.9401V5.95164H50.8767C52.6184 5.95164 54.1141 6.30748 55.3639 7.01918C56.6137 7.72509 57.5713 8.74056 58.2367 10.0656C58.9079 11.3848 59.2435 12.9674 59.2435 14.8131C59.2435 16.6647 58.905 18.2559 58.228 19.5867C57.5569 20.9175 56.5848 21.9417 55.3118 22.6592C54.0389 23.3709 52.4997 23.7267 50.6945 23.7267ZM47.622 21.3833H50.5469C51.9009 21.3833 53.0263 21.1287 53.9231 20.6195C54.82 20.1046 55.4912 19.3611 55.9367 18.389C56.3823 17.4111 56.605 16.2192 56.605 14.8131C56.605 13.4187 56.3823 12.2354 55.9367 11.2633C55.497 10.2913 54.8403 9.55352 53.9665 9.05012C53.0928 8.54673 52.0079 8.29503 50.7118 8.29503H47.622V21.3833ZM69.061 23.9958C67.7476 23.9958 66.6164 23.7151 65.6674 23.1539C64.7243 22.5868 63.9952 21.7912 63.4803 20.7671C62.9711 19.7372 62.7165 18.5307 62.7165 17.1479C62.7165 15.7823 62.9711 14.5788 63.4803 13.5373C63.9952 12.4958 64.7127 11.6828 65.6327 11.0984C66.5585 10.514 67.6405 10.2218 68.8788 10.2218C69.631 10.2218 70.36 10.3462 71.0659 10.595C71.7718 10.8438 72.4054 11.2344 72.9667 11.7667C73.5279 12.2991 73.9706 12.9905 74.2946 13.8411C74.6186 14.6858 74.7806 15.7129 74.7806 16.9222V17.8422H64.1833V15.898H72.2376C72.2376 15.2153 72.0987 14.6106 71.821 14.0841C71.5433 13.5518 71.1527 13.1323 70.6493 12.8256C70.1517 12.5189 69.5673 12.3656 68.8961 12.3656C68.1671 12.3656 67.5306 12.545 66.9867 12.9037C66.4486 13.2567 66.032 13.7196 65.7369 14.2924C65.4476 14.8594 65.3029 15.4757 65.3029 16.1411V17.6599C65.3029 18.551 65.4591 19.309 65.7716 19.9339C66.0898 20.5588 66.5325 21.0362 67.0995 21.366C67.6666 21.69 68.3291 21.852 69.0871 21.852C69.5789 21.852 70.0273 21.7826 70.4323 21.6437C70.8374 21.499 71.1874 21.285 71.4825 21.0014C71.7776 20.7179 72.0033 20.3679 72.1595 19.9512L74.6157 20.3939C74.419 21.1172 74.066 21.7507 73.5569 22.2946C73.0535 22.8328 72.4199 23.2523 71.6561 23.5531C70.8981 23.8482 70.0331 23.9958 69.061 23.9958ZM78.8134 23.7267V5.95164H89.8361V8.26031H81.4953V13.6762H89.0462V15.9762H81.4953V23.7267H78.8134ZM93.871 23.7267V10.3954H96.4661V23.7267H93.871ZM95.1816 8.33843C94.7303 8.33843 94.3426 8.18799 94.0186 7.88711C93.7003 7.58044 93.5412 7.21591 93.5412 6.79352C93.5412 6.36535 93.7003 6.00082 94.0186 5.69994C94.3426 5.39327 94.7303 5.23994 95.1816 5.23994C95.6329 5.23994 96.0177 5.39327 96.3359 5.69994C96.6599 6.00082 96.8219 6.36535 96.8219 6.79352C96.8219 7.21591 96.6599 7.58044 96.3359 7.88711C96.0177 8.18799 95.6329 8.33843 95.1816 8.33843ZM108.524 23.7267V5.95164H114.86C116.243 5.95164 117.389 6.20333 118.297 6.70673C119.205 7.21013 119.885 7.89868 120.337 8.77239C120.788 9.64031 121.014 10.6182 121.014 11.706C121.014 12.7996 120.785 13.7832 120.328 14.6569C119.877 15.5248 119.194 16.2134 118.28 16.7226C117.371 17.226 116.228 17.4777 114.851 17.4777H110.494V15.2037H114.608C115.482 15.2037 116.191 15.0533 116.735 14.7524C117.279 14.4457 117.678 14.0291 117.932 13.5026C118.187 12.976 118.314 12.3772 118.314 11.706C118.314 11.0348 118.187 10.4388 117.932 9.91805C117.678 9.39729 117.276 8.98937 116.726 8.69428C116.182 8.39918 115.465 8.25163 114.574 8.25163H111.206V23.7267H108.524ZM130.343 23.9958C129.093 23.9958 128.002 23.7094 127.071 23.1365C126.139 22.5637 125.416 21.7623 124.901 20.7324C124.386 19.7024 124.129 18.4989 124.129 17.1218C124.129 15.7389 124.386 14.5296 124.901 13.4939C125.416 12.4582 126.139 11.6539 127.071 11.0811C128.002 10.5082 129.093 10.2218 130.343 10.2218C131.593 10.2218 132.683 10.5082 133.615 11.0811C134.546 11.6539 135.27 12.4582 135.785 13.4939C136.3 14.5296 136.557 15.7389 136.557 17.1218C136.557 18.4989 136.3 19.7024 135.785 20.7324C135.27 21.7623 134.546 22.5637 133.615 23.1365C132.683 23.7094 131.593 23.9958 130.343 23.9958ZM130.352 21.8173C131.162 21.8173 131.833 21.6032 132.365 21.175C132.897 20.7468 133.291 20.1769 133.545 19.4652C133.806 18.7535 133.936 17.9695 133.936 17.1131C133.936 16.2626 133.806 15.4814 133.545 14.7697C133.291 14.0523 132.897 13.4765 132.365 13.0426C131.833 12.6086 131.162 12.3916 130.352 12.3916C129.536 12.3916 128.859 12.6086 128.321 13.0426C127.788 13.4765 127.392 14.0523 127.132 14.7697C126.877 15.4814 126.75 16.2626 126.75 17.1131C126.75 17.9695 126.877 18.7535 127.132 19.4652C127.392 20.1769 127.788 20.7468 128.321 21.175C128.859 21.6032 129.536 21.8173 130.352 21.8173ZM146.014 23.9958C144.765 23.9958 143.674 23.7094 142.742 23.1365C141.811 22.5637 141.088 21.7623 140.573 20.7324C140.058 19.7024 139.8 18.4989 139.8 17.1218C139.8 15.7389 140.058 14.5296 140.573 13.4939C141.088 12.4582 141.811 11.6539 142.742 11.0811C143.674 10.5082 144.765 10.2218 146.014 10.2218C147.264 10.2218 148.355 10.5082 149.287 11.0811C150.218 11.6539 150.941 12.4582 151.456 13.4939C151.971 14.5296 152.229 15.7389 152.229 17.1218C152.229 18.4989 151.971 19.7024 151.456 20.7324C150.941 21.7623 150.218 22.5637 149.287 23.1365C148.355 23.7094 147.264 23.9958 146.014 23.9958ZM146.023 21.8173C146.833 21.8173 147.504 21.6032 148.037 21.175C148.569 20.7468 148.963 20.1769 149.217 19.4652C149.477 18.7535 149.608 17.9695 149.608 17.1131C149.608 16.2626 149.477 15.4814 149.217 14.7697C148.963 14.0523 148.569 13.4765 148.037 13.0426C147.504 12.6086 146.833 12.3916 146.023 12.3916C145.207 12.3916 144.53 12.6086 143.992 13.0426C143.46 13.4765 143.064 14.0523 142.803 14.7697C142.549 15.4814 142.421 16.2626 142.421 17.1131C142.421 17.9695 142.549 18.7535 142.803 19.4652C143.064 20.1769 143.46 20.7468 143.992 21.175C144.53 21.6032 145.207 21.8173 146.023 21.8173ZM158.666 5.95164V23.7267H156.071V5.95164H158.666Z"
                  fill="white"
                />
              </svg>

              <HideWhenSmall>
                <Socials />
              </HideWhenSmall>
            </Box>
          </Box>
          <RowToCol
            direction="row"
            height="100%"
            gap={screenIsLarge ? '150px' : '16px'}
            style={{
              maxWidth: '600px',
              flexDirection: screenIsPhone ? 'row' : 'column',
              width: screenIsPhone ? '100%' : 'auto',
              justifyContent: screenIsPhone ? 'space-between' : 'flex-end',
            }}
          >
            <Box
              direction="row"
              gap="16px"
              style={{
                maxWidth: 'fit-content',
                minWidth: '100px',
                whiteSpace: 'nowrap',
              }}
            >
              <Box direction="column" gap="10px">
                <Body1>App</Body1>
                <StyledInternalLink to="/swap">
                  <Trans>Swap</Trans>
                </StyledInternalLink>
                <StyledInternalLink to="/pool">
                  <Trans>Pool</Trans>
                </StyledInternalLink>
              </Box>
            </Box>
            {showDeprecated ? (
              <Box direction="row" gap="16px">
                <Box direction="column" gap="10px">
                  <Body1>
                    <Trans>Info</Trans>
                  </Body1>
                  <ModalItem onClick={togglePrivacyPolicy}>
                    <Trans>Terms & Privacy</Trans>
                  </ModalItem>
                </Box>
              </Box>
            ) : null}
            <Box
              direction="row"
              gap="16px"
              style={{
                minWidth: '100px',
                maxWidth: 'fit-content',
                whiteSpace: 'nowrap',
              }}
            >
              <Box direction="column" gap="10px">
                <Body1>
                  <Trans>Info</Trans>
                </Body1>
                <StyledInternalLink
                  to="#"
                  style={{
                    cursor: 'not-allowed',
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Trans>Terms & Conditions</Trans>
                </StyledInternalLink>
                <StyledInternalLink
                  to="#"
                  style={{
                    cursor: 'not-allowed',
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Trans>Privacy Policy</Trans>
                </StyledInternalLink>
              </Box>
            </Box>
          </RowToCol>
          <HideWhenLarge>
            <Socials />
          </HideWhenLarge>
        </RowToCol>
      </Box>
      <Reserved>©2024 All rights reserved</Reserved>
    </Box>
  )
}
