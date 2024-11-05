import React from 'react'
import styled from 'styled-components'
import { useIsMobile } from '../../../nft/hooks'
import { H2 } from '../components/Generics'
import NewsCard from '../components/news/NewsCard'
import TickerBlock from '../components/news/TickerBlock'

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: -webkit-fill-available;
  min-width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    overflow: hidden;
  }
`
const SectionLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0;
  max-width: 93vw;
  margin: 0 auto;
  overflow: hidden;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding: 0 48px;
  }
  @media (max-width: 468px) {
    padding: 0 8px;
  }
`
const Title = styled(H2)`
  width: 100%;
  text-align: left;
  margin: 0;
  margin-bottom: 40px;
  font-size: 48px;
  font-style: normal;
  line-height: 52px;
  font-family: Inter;
  color: #fff;
  font-weight: 800;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    text-align: left;
    margin-bottom: 24px;
    font-size: 32px;
    font-weight: 500;
    line-height: 40px;
  }
`
const NewsBlock = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 0;
  width: 100%;
  overflow: hidden;
  height: fit-content;
  margin: 0;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    overflow: hidden;
    align-items: flex-start;
    padding: 0;
    width: 100%;
    gap: 20px;
    height: fit-content;
  }
`

interface INews {
  text?: string
  content?: React.ReactNode | JSX.Element
  bg_image?: string
  href: string
}

const LatestNews = () => {
  const news_block: INews[] = [
    {
      text: 'KuCoin Backs Patex (PATEX): A Major Move Towards CBDC Adoption',
      bg_image: '/images/news/1s.avif',
      href: 'https://coinedition.com/kucoin-backs-patex-patex-a-major-move-towards-cbdc-adoption/',
    },
    {
      content: (
        <div>
          <p>Title</p>
          <p>Content</p>
        </div>
      ),
      bg_image: '/images/news/1s.avif',
      href: 'https://coinedition.com/kucoin-backs-patex-patex-a-major-move-towards-cbdc-adoption/',
    },
  ]
  const isMobile = useIsMobile()
  return (
    <SectionWrapper>
      <SectionLayout>
        <Title>Latest news</Title>
      </SectionLayout>
      <NewsBlock>
        <TickerBlock
          items={news_block.slice(0, 5)}
          speed={isMobile ? 200000 : 99000}
          animationDirection="normal"
          RenderItem={NewsCard}
        />
      </NewsBlock>
    </SectionWrapper>
  )
}

export default LatestNews
