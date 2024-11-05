import { memo, useRef, useState } from 'react'
import styled from 'styled-components'

import { showDeprecated } from '../../utils/showDeprecated'
import DFPSection from './sections/DFPSection'
import { DirectToDefi } from './sections/DirectToDefi'
import { Footer } from './sections/Footer'
import HeroNew from './sections/HeroNew'
import { HeroOld } from './sections/HeroOld'
import LatestNews from './sections/LatestNews'
import { NewsletterEtc } from './sections/NewsletterEtc'
import ProductsBlocks from './sections/ProductsBlocks'
import RunningBanners from './sections/RunningBanners'
import SectionBanner from './sections/SectionBanner'
import SeedRound from './sections/SeedRound'
import SingleEcosystem from './sections/SingleEcosystem'
import { Stats } from './sections/Stats'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 120px;
  @media (max-width: 1024px) {
    gap: 80px;
  }
  margin-top: -72px;
  //min-width: 100%;
  max-width: 1240px;
  //max-width: 98vw;
  overflow: hidden;
  z-index: 1;
`

const HomeSectionBg = styled.div`
  background: url('/images/home-hero-bg.webp'), linear-gradient(132deg, #1324ee -4.92%, #0b1588 286.53%);
  //width: '90%',
  //position: 'absolute',
  //top: 0,
  //left: 0,
  //zIndex: 1,
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
  border-radius: 0px 0px 40px 40px;
`
const Grain = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(/images/noise-color.png);
  opacity: 0.018;
  z-index: 0;
`

function LandingV2() {
  const scrollAnchor = useRef<HTMLDivElement | null>(null)
  const [heroH, setHeroH] = useState<undefined | number>(undefined)
  const showOldVersion = false
  return !showOldVersion ? (
    <>
      <Grain />
      <HomeSectionBg
        style={{
          height: heroH ? `${heroH}px` : '100vh',
        }}
      />
      <Container data-testid="landing-page">
        <HeroNew setHeroH={setHeroH} />
        <SingleEcosystem />
        <ProductsBlocks />
        <DFPSection />
        {showDeprecated ? <SeedRound /> : null}
        <LatestNews />
        <RunningBanners />
        <SectionBanner />
        <Footer />
      </Container>
    </>
  ) : (
    <>
      <Grain />
      <Container data-testid="landing-page">
        <HeroOld
          scrollToRef={() => {
            scrollAnchor.current?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
        <div ref={scrollAnchor}>
          <DirectToDefi />
        </div>
        <Stats />
        <NewsletterEtc />
        <Footer />
      </Container>
    </>
  )
}

export default memo(LandingV2)
