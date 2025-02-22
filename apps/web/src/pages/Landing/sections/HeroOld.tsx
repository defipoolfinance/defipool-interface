import { Trans } from '@lingui/macro'
import { ColumnCenter } from 'components/Column'
import { useCurrency } from 'hooks/Tokens'
import { Swap } from 'pages/Swap'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'react-feather'
import styled, { css, keyframes } from 'styled-components'

import { BREAKPOINTS } from 'theme'
import { Text } from 'ui/src'
import { heightBreakpoints } from 'ui/src/theme'
import { Box, H1 } from '../components/Generics'
import { TokenCloud } from '../components/TokenCloud'
import { Hover, RiseIn, RiseInText } from '../components/animations'

const Container = styled(Box)`
  min-width: 100%;
  padding-top: 72px;
`
const LandingSwapContainer = styled(Box)`
  width: 480px;
  padding: 8px;
  border-radius: 24px;
  background: ${({ theme }) => theme.surface1};
  @media (max-width: 768px) {
    width: 100%;
  }
`
const LandingSwap = styled(Swap)`
  position: relative;
  width: 100%;

  & > div:first-child {
    padding: 0;
  }
  & > div:first-child > div:first-child {
    display: none;
  }
`
const StyledH1 = styled(H1)`
  @media (max-width: 768px) {
    font-size: 52px;
  }
  @media (max-width: 464px) {
    font-size: 36px;
  }
  @media (max-height: 668px) {
    font-size: 28px;
  }
`
const shrinkAndFade = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
`
const Center = styled(Box)<{ transition?: boolean }>`
  width: unset;
  pointer-events: none;
  padding: 48px 0;
  @media (max-width: 464px), (max-height: 700px) {
    padding-top: 24px;
  }
  @media (max-width: 464px), (max-height: 668px) {
    padding-top: 8px;
  }
  gap: 24px;
  @media (max-height: 800px) {
    gap: 16px;
  }
  ${({ transition }) =>
    transition &&
    css`
      animation: ${shrinkAndFade} 1s ease-in-out forwards;
    `};
`
const LearnMoreContainer = styled(Box)`
  bottom: 48px;
  @media (max-width: ${BREAKPOINTS.md}px) {
    bottom: 64px;
  }

  @media (max-height: ${heightBreakpoints.short}px) {
    display: none;
  }
`

interface HeroProps {
  scrollToRef: () => void
  transition?: boolean
}

function HeroOld({ scrollToRef, transition }: HeroProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }
  const initialInputCurrency = useCurrency('ETH')

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const translateY = -scrollPosition / 7
  const opacityY = 1 - scrollPosition / 1000

  return (
    <Container
      position="relative"
      height="100vh"
      justify="center"
      style={{ transform: `translate(0, ${translateY}px)`, opacity: opacityY }}
    >
      <TokenCloud transition={transition} />
      <Center
        direction="column"
        align="center"
        maxWidth="85vw"
        transition={transition}
        style={{ transform: `translate(0, ${translateY}px)`, opacity: opacityY }}
      >
        <Box direction="column" align="center">
          <StyledH1>
            <RiseInText delay={0.0}>
              <Trans>Swap</Trans>
            </RiseInText>{' '}
            <RiseInText delay={0.1}>
              <Trans>anytime,</Trans>
            </RiseInText>
          </StyledH1>
          <RiseIn delay={0.2}>
            <StyledH1>
              <Trans>anywhere.</Trans>
            </StyledH1>
          </RiseIn>
        </Box>

        <RiseIn delay={0.4}>
          <LandingSwapContainer>
            <LandingSwap syncTabToUrl={false} initialInputCurrency={initialInputCurrency} />
          </LandingSwapContainer>
        </RiseIn>

        <RiseIn delay={0.3}>
          <Text
            variant="body1"
            textAlign="center"
            maxWidth={430}
            color="$neutral2"
            $short={{
              variant: 'body2',
            }}
          >
            <Trans>The largest onchain marketplace. Buy and sell crypto on Ethereum and 7+ other chains.</Trans>
          </Text>
        </RiseIn>
      </Center>
      <LearnMoreContainer
        position="absolute"
        width="100%"
        align="center"
        justify="center"
        pointerEvents="none"
        style={{ transform: `translate(0, ${translateY}px)`, opacity: opacityY }}
      >
        <RiseIn delay={0.3}>
          <Box
            direction="column"
            align="center"
            justify="flex-start"
            onClick={() => scrollToRef()}
            style={{ cursor: 'pointer' }}
            width="500px"
          >
            <Hover>
              <ColumnCenter>
                <Text variant="body2">
                  <Trans>Scroll to learn more</Trans>
                </Text>
                <ChevronDown />
              </ColumnCenter>
            </Hover>
          </Box>
        </RiseIn>
      </LearnMoreContainer>
    </Container>
  )
}
export { HeroOld }
