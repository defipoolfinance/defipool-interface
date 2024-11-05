import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { UniIcon } from 'components/Logo/UniIcon'
import Web3Status from 'components/Web3Status'
import { chainIdToBackendName } from 'graphql/data/util'
import { useDisableNFTRoutes } from 'hooks/useDisableNFTRoutes'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { useIsPoolsPage } from 'hooks/useIsPoolsPage'
import { Box } from 'nft/components/Box'
import { Row } from 'nft/components/Flex'
import { useIsMobile, useProfilePageState } from 'nft/hooks'
import { ProfilePageStateType } from 'nft/types'
import { ReactNode, useCallback } from 'react'
import { NavLink, NavLinkProps, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useAccountDrawer } from 'components/AccountDrawer/MiniPortfolio/hooks'
import { Z_INDEX } from 'theme/zIndex'
import { Chain } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { useIsNavSearchInputVisible } from '../../nft/hooks/useIsNavSearchInputVisible'
import { Bag } from './Bag'
import Blur from './Blur'
import { ChainSelector } from './ChainSelector'
// import { More } from './More'
import { GetTheAppButton } from 'pages/Landing/components/DownloadApp/GetTheAppButton'
import { useIsLandingPage } from '../../hooks/useIsLandingPage'
import { showDeprecated } from '../../utils/showDeprecated'
import HolidayUniIcon from '../Logo/HolidayUniIcon'
import { SearchBar } from './SearchBar'
import * as styles from './style.css'

const Nav = styled.nav`
  padding: ${({ theme }) => `${theme.navVerticalPad}px 12px`};
  width: 100%;
  height: ${({ theme }) => theme.navHeight}px;
  z-index: ${Z_INDEX.sticky};
  max-width: 1240px;
  margin: 0 auto;
`

interface MenuItemProps {
  href: string
  id?: NavLinkProps['id']
  isActive?: boolean
  children: ReactNode
  dataTestId?: string
}

const MenuItem = ({ href, dataTestId, id, isActive, children }: MenuItemProps) => {
  return (
    <NavLink
      to={href}
      className={isActive ? styles.activeMenuItem : styles.menuItem}
      id={id}
      style={{ textDecoration: 'none' }}
      data-testid={dataTestId}
    >
      {children}
    </NavLink>
  )
}

export const PageTabs = () => {
  const { pathname } = useLocation()
  const { chainId: connectedChainId } = useWeb3React()
  const chainName = chainIdToBackendName(connectedChainId)

  const isPoolActive = useIsPoolsPage()
  const isNftPage = useIsNftPage()

  const shouldDisableNFTRoutes = useDisableNFTRoutes()

  return (
    <>
      <MenuItem href="/swap" isActive={pathname.startsWith('/swap')}>
        <Trans>Swap</Trans>
      </MenuItem>
      {showDeprecated ? (
        <MenuItem
          href={'/explore' + (chainName !== Chain.Ethereum ? `/${chainName.toLowerCase()}` : '')}
          isActive={pathname.startsWith('/explore')}
        >
          <Trans>Explore</Trans>
        </MenuItem>
      ) : null}
      {!shouldDisableNFTRoutes && (
        <MenuItem dataTestId="nft-nav" href="/nfts" isActive={isNftPage}>
          <Trans>NFTs</Trans>
        </MenuItem>
      )}
      <MenuItem href="/pool" dataTestId="pool-nav-link" isActive={isPoolActive}>
        <Trans>Pool</Trans>
      </MenuItem>
      {/*<More />*/}
    </>
  )
}

const Navbar = ({ blur }: { blur: boolean }) => {
  const isNftPage = useIsNftPage()
  const isLandingPage = useIsLandingPage()
  const sellPageState = useProfilePageState((state) => state.state)
  const navigate = useNavigate()
  const isNavSearchInputVisible = useIsNavSearchInputVisible()

  const { account } = useWeb3React()
  const [accountDrawerOpen, toggleAccountDrawer] = useAccountDrawer()
  const handleUniIconClick = useCallback(() => {
    if (account) {
      return
    }
    if (accountDrawerOpen) {
      toggleAccountDrawer()
    }
    navigate({
      pathname: '/',
      search: '?intro=true',
    })
  }, [account, accountDrawerOpen, navigate, toggleAccountDrawer])
  const isMobile = useIsMobile()

  const iconOld = <HolidayUniIcon />
  const showOldVersion = isLandingPage && false
  const showSearchBar = false
  return (
    <>
      {blur && <Blur />}
      <Nav>
        <Box
          display="flex"
          height="full"
          flexWrap="nowrap"
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Box
            className={styles.leftSideContainer}
            style={{
              width: '100%',
              flex: 'inherit',
              alignItems: 'center',
              justifyContent: 'space-between',
              display: 'flex',
              // backgroundColor: 'red',
            }}
          >
            <Box
              className={styles.logoContainer}
              // style={{
              //   backgroundColor: 'blue',
            >
              <UniIcon
                data-testid="uniswap-logo"
                className={styles.logo}
                clickable={!account}
                onClick={handleUniIconClick}
              />
            </Box>
            {!isNftPage && (
              <Box display={{ sm: 'flex', lg: 'none' }}>
                <ChainSelector leftAlign={false} />
              </Box>
            )}
            <Row
              display={{ sm: 'none', lg: 'flex' }}
              style={{
                gap: '14px',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginRight: 'auto',
              }}
            >
              <PageTabs />
            </Row>
          </Box>
          {showSearchBar ? (
            <Box
              className={styles.searchContainer}
              {...(isNavSearchInputVisible && {
                display: 'flex',
              })}
            >
              <SearchBar />
            </Box>
          ) : null}
          <Box
            className={styles.rightSideContainer}
            style={{
              // backgroundColor: 'green',
              display: 'flex',
              whiteSpace: 'nowrap',
              width: 'fit-content',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Row gap="12">
              {!isMobile && showSearchBar && (
                <Box position="relative" display={isNavSearchInputVisible ? 'none' : { sm: 'flex' }}>
                  <SearchBar />
                </Box>
              )}
              {isNftPage && sellPageState !== ProfilePageStateType.LISTING && <Bag />}
              {!isNftPage && (
                <Box display={{ sm: 'none', lg: 'flex' }}>
                  <ChainSelector />
                </Box>
              )}
              {showOldVersion && (
                <>
                  <GetTheAppButton />
                  {iconOld}
                </>
              )}
              <Web3Status />
            </Row>
          </Box>
        </Box>
      </Nav>
    </>
  )
}

export default Navbar
