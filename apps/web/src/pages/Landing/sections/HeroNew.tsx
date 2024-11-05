import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Trans } from '@lingui/macro'
import { ArrButton } from 'components/Button/ArrButton'
import { Swap } from 'pages/Swap'
import { useNavigate } from 'react-router-dom'
import { loadingAnimation } from '../../../components/Loader/styled'
import { useTopTokens } from '../../../graphql/data/TopTokens'
import { validateUrlChainParam } from '../../../graphql/data/util'
import { useCurrency } from '../../../hooks/Tokens'
import { NumberType, useFormatter } from '../../../utils/formatNumbers'
import { showDeprecated } from '../../../utils/showDeprecated'
import { useExploreParams } from '../../Explore/redirects'
import { Box } from '../components/Generics'
import { RiseIn } from '../components/animations'

const ContainerSwap = styled(Box)`
  width: fit-content !important;

  div {
    &:nth-of-type(1) {
    }
  }

  @media (max-width: 1024px) {
    width: 100% !important;
  }
`
const Container = styled(Box)`
  min-width: 100%;
  min-height: 800px;
  padding: 156px 12px 103px 12px;
  border-radius: 0 0 40px 40px;
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;

  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding: 108px 12px 56px 12px;
  }
`
const HeroWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  padding: 0 0;
  max-width: 93vw;
  min-height: 590px;
  margin: 0 auto;
  width: 100%;
  @media (max-width: 1024px) {
    flex-direction: column;
    min-height: fit-content;
    gap: 16px;
    max-width: 100%;
  }

  > div {
    width: 100%;
  }
`
const HeroText = styled.div`
  max-width: 520px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.lg}px`}) {
    max-width: 100%;
  }

  display: flex;
  flex-direction: column;
  gap: 20px;

  h1 {
    padding-top: 62px;
    @media (max-width: ${({ theme }) => `${theme.breakpoint.lg}px`}) {
      padding-top: 20px;
    }
    @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
      padding-top: 24px;
    }
    margin: 0;
    color: #fff;
    font-family: Inter;
    font-size: 52px;
    font-style: normal;
    font-weight: 600;
    line-height: 62px;
    @media (max-width: 1024px) {
      font-size: 36px;
    }
  }

  p {
    margin: 0;
    color: #b4b4b4;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 30px;
    @media (max-width: 1024px) {
      font-size: 16px;
    }
  }
`
const TokensBlockLoading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 32px;
  border-radius: 16px;
  background: #f8f9fa;
  min-width: 577px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    min-width: 100%;
  }
  position: relative;
  animation: ${loadingAnimation} 1.5s infinite;
  animation-fill-mode: both;
  background: linear-gradient(
    to left,
    ${({ theme }) => theme.surface3} 25%,
    ${({ theme }) => theme.surface3} 50%,
    ${({ theme }) => theme.surface3} 75%
  );
  will-change: background-position;
  background-size: 400%;
`
const TokensBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 32px;
  border-radius: 16px;
  background: #f8f9fa;
  min-width: 577px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    min-width: 100%;
  }
`
const TokensList = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0;
  width: 100%;
`
const TokenItemInfoLoading = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  flex-direction: row;

  > div {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 5px;
    flex-direction: column;

    p {
      background: linear-gradient(
        to left,
        ${({ theme }) => theme.surface4} 25%,
        ${({ theme }) => theme.surface4} 50%,
        ${({ theme }) => theme.surface4} 75%
      );
      animation: ${loadingAnimation} 1.5s infinite;
      animation-fill-mode: both;
      will-change: background-position;
      background-size: 400%;
      margin: 0;
      border-radius: 14px;
      height: 15px;
    }

    span {
      height: 10px;
      background: linear-gradient(
        to left,
        ${({ theme }) => theme.surface4} 25%,
        ${({ theme }) => theme.surface4} 50%,
        ${({ theme }) => theme.surface4} 75%
      );
      animation: ${loadingAnimation} 1.5s infinite;
      animation-fill-mode: both;
      will-change: background-position;
      background-size: 400%;
      border-radius: 14px;
      margin: 0;
    }
  }
`
const TokenItemPriceLoading = styled.div`
  background: linear-gradient(
    to left,
    ${({ theme }) => theme.surface4} 25%,
    ${({ theme }) => theme.surface4} 50%,
    ${({ theme }) => theme.surface4} 75%
  );
  animation: ${loadingAnimation} 1.5s infinite;
  animation-fill-mode: both;
  will-change: background-position;
  background-size: 400%;
  margin: 0;
  border-radius: 14px;
  height: 15px;
`
const TokenItemPercentChangeLoading = styled.div`
  background: linear-gradient(
    to left,
    ${({ theme }) => theme.surface4} 25%,
    ${({ theme }) => theme.surface4} 50%,
    ${({ theme }) => theme.surface4} 75%
  );
  animation: ${loadingAnimation} 1.5s infinite;
  animation-fill-mode: both;
  will-change: background-position;
  background-size: 400%;
  margin: 0;
  border-radius: 14px;
  height: 15px;
`
const TokenItemImageLoading = styled.div`
  width: 42px;
  height: 42px;
  min-height: 42px;
  min-width: 42px;
  border-radius: 100%;
  animation: ${loadingAnimation} 1.5s infinite;
  animation-fill-mode: both;
  background: linear-gradient(
    to left,
    ${({ theme }) => theme.surface4} 25%,
    ${({ theme }) => theme.surface4} 50%,
    ${({ theme }) => theme.surface4} 75%
  );
  will-change: background-position;
  background-size: 400%;
`
const TokenItemEmpty = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 14px 0;
  width: 100%;
`

const TokenItemInfo = styled(Box)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  flex-direction: row;

  > div {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    //gap: 2px;
    flex-direction: column;

    img {
      width: 42px;
      height: 42px;
    }

    p {
      color: #080809;
      font-feature-settings: 'clig' off, 'liga' off;
      // font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 24px;
      margin: 0;
    }

    span {
      color: #8b8d98;
      font-feature-settings: 'clig' off, 'liga' off;
      // font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px;
    }
  }
`
const TokenItemPrice = styled(Box)`
  color: #080809;
  display: inline-flex;
  justify-content: flex-end;
  font-feature-settings: 'clig' off, 'liga' off;
  // font-family: Inter;
  margin-left: auto;
  width: 100%;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
`
const TokenItemPercentChange = styled(Box)`
  text-align: right;
  display: inline-flex;
  justify-content: flex-end;
  width: 100%;
  color: #0ca54a;
  font-feature-settings: 'clig' off, 'liga' off;
  // font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
`
const TokenItem = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 14px 0;
  width: 100%;
`

const BestExchangeButton = styled.div`
  cursor: pointer;
  display: flex;
  padding: 6px 18px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: fit-content;
  border-radius: 100px;
  background: #fff;

  color: #14151d;
  font-feature-settings: 'clig' off, 'liga' off;
  // font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  text-transform: uppercase;
  transition: ${({ theme }) => theme.transition.duration.medium};

  :hover {
    opacity: ${({ theme }) => theme.opacity.hover};
  }
`

const GetStartedButton = styled.div`
  padding-top: 82px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.lg}px`}) {
    padding-top: 14px;
  }
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`

const ViewAllButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LandingSwapContainer = styled(Box)`
  width: 576px;
  padding: 8px;
  border-radius: 24px;
  background: ${({ theme }) => theme.neutral1};
  @media (max-width: 1024px) {
    width: 100% !important;
  }
  @media (max-width: 768px) {
    width: 100% !important;
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

function HeroNew({ setHeroH }: { setHeroH(h: number): void }) {
  const heroRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (heroRef.current) {
      setHeroH(heroRef.current.clientHeight)
    }
  }, [setHeroH])
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const translateY = -scrollPosition / 7
  const opacityY = 1 - scrollPosition / 1000
  const chainName = validateUrlChainParam(useExploreParams().chainName)
  const { tokens, loadingTokens } = useTopTokens(chainName)
  const { formatNumber } = useFormatter()

  const tenEmptyNbsp = Array(10)
    .fill(0)
    .map(() => '\u00A0')
    .join('')

  const oldVersion = loadingTokens ? (
    <TokensBlockLoading>
      <TokensList>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <TokenItemEmpty key={i}>
              <TokenItemInfoLoading>
                <TokenItemImageLoading />
                <Box>
                  <p>{tenEmptyNbsp}</p>
                  <span>{tenEmptyNbsp}</span>
                </Box>
              </TokenItemInfoLoading>
              <TokenItemPriceLoading>{tenEmptyNbsp}</TokenItemPriceLoading>
              <TokenItemPercentChangeLoading>{tenEmptyNbsp}</TokenItemPercentChangeLoading>
            </TokenItemEmpty>
          ))}
      </TokensList>
      <ViewAllButton>
        <ArrButton size="small" color="#8B8D98">
          <span>View all coins (100+)</span>
        </ArrButton>
      </ViewAllButton>
    </TokensBlockLoading>
  ) : (
    <TokensBlock>
      <TokensList>
        {tokens?.slice(0, 5)?.map((t) => {
          if (!t) return null
          const { symbol, name } = t
          const price = formatNumber({
            input: t?.market?.price?.value,
            type: NumberType.FiatTokenDetails,
          })
          const pricePercentChange1Day = t?.market?.pricePercentChange1Day?.value?.toFixed(4) || 0
          const pricePercentChangeColor = +pricePercentChange1Day > 0 ? '#0ca54a' : '#ff4d4f'
          return (
            <TokenItem key={t.id}>
              <TokenItemInfo>
                {t?.project?.logoUrl && (
                  <img src={t.project.logoUrl} alt={t.name} style={{ width: 32, height: 32, borderRadius: 16 }} />
                )}
                <Box>
                  <p>{symbol}</p>
                  <span>{name}</span>
                </Box>
              </TokenItemInfo>
              <TokenItemPrice>{price}</TokenItemPrice>
              <TokenItemPercentChange
                style={{
                  color: pricePercentChangeColor,
                }}
              >
                {pricePercentChange1Day}%
              </TokenItemPercentChange>
            </TokenItem>
          )
        })}
      </TokensList>
      <ViewAllButton>
        <ArrButton size="small" color="#8B8D98">
          <span>View all coins (100+)</span>
        </ArrButton>
      </ViewAllButton>
    </TokensBlock>
  )

  const showOldHero = true

  const initialInputCurrency = useCurrency('ETH')

  const navigate = useNavigate()
  const swapView = (
    <ContainerSwap>
      <RiseIn delay={0.4}>
        <LandingSwapContainer>
          <LandingSwap syncTabToUrl={false} initialInputCurrency={initialInputCurrency} />
        </LandingSwapContainer>
      </RiseIn>
    </ContainerSwap>
  )
  return (
    <Container
      ref={heroRef}
      position="relative"
      height="fit-content"
      justify="center"
      style={{
        transform: showDeprecated ? `translate(0, ${translateY}px)` : 'unset',
        opacity: showDeprecated ? opacityY : '1',
      }}
    >
      <HeroWrapper>
        <div>
          <BestExchangeButton
            onClick={() => {
              navigate('/swap')
            }}
          >
            best exchange
          </BestExchangeButton>
          <HeroText>
            <h1>
              <Trans>Exchange all DEXs at the same time</Trans>
            </h1>
            <p>
              <Trans>Matcha finds you the best prices across exchanges and combines them into one trade.</Trans>
            </p>
          </HeroText>
          <GetStartedButton>
            <ArrButton size="medium" color="#fff">
              <span
                onClick={() => {
                  navigate('/swap')
                }}
              >
                Get Started
              </span>
            </ArrButton>
          </GetStartedButton>
        </div>
        {showOldHero ? swapView : oldVersion}
      </HeroWrapper>
    </Container>
  )
}

export default HeroNew
