import { OpacityHoverState } from 'components/Common'
import styled from 'styled-components'
import { useIsMobile } from '../../../nft/hooks'

const SectionLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0;
  max-width: 93vw;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding: 0 48px;
  }
  @media (max-width: 468px) {
    padding: 0 8px;
  }
`
const SectionCol = styled.div`
  flex-direction: column;
  max-width: 93vw;
  gap: 40px;
  width: 100%;

  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    gap: 24px;
  }
`
const RowToCol = styled.div`
  height: auto;
  width: 100%;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  max-width: 93vw;
`
const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  @media (max-width: 1130px) {
    flex-direction: column;
  }
`
const FirstBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 530px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    max-width: 100%;
  }

  .badge {
    border-radius: 100px;
    background: #1324ee;
    display: flex;
    padding: 6px 18px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;

    color: #fff;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    text-transform: uppercase;
    @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
      font-size: 12px;
      line-height: 18px;
      margin-bottom: 16px;
    }
  }

  h2 {
    padding: 0;
    margin: 0;
    color: #fff;
    margin-bottom: 16px;

    font-family: Inter;
    font-size: 48px;
    font-style: normal;
    font-weight: 600;
    line-height: 52px;
    @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
      font-size: 32px;
      font-weight: 500;
      line-height: 40px;
    }
  }

  p {
    padding: 0;
    margin: 0;
    color: #b4b4b4;

    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
`
const DfpImage = styled.img`
  width: 309px;
  height: 309px;
  margin: 33px 92px 24px 130px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: 263px;
    height: 263px;
    margin: 30px auto;
  }
`

const Link = styled.a`
  color: ${({ theme }) => theme.neutral1};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  text-decoration-line: none;
  padding: 0;
  margin: 0;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: 130px;
    min-width: 130px;
    max-width: 130px;
    justify-content: flex-start;
    align-items: flex-start;
  }

  p {
    padding: 0;
    margin: 0;
    border-bottom: 1px solid #fff;
    padding-bottom: 4px;
  }

  ${OpacityHoverState}
`
const LinksBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  gap: 16px;
  margin-top: 0px;
  margin-bottom: 16px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    margin-top: 16px;
    flex-wrap: wrap;
    width: 275px;
    gap: 8px;
  }
`

const SecondBlock = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    gap: 10px;
  }
  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    flex-wrap: nowrap;
    flex-direction: column;
    gap: 8px;
  }

  .block {
    display: flex;
    border-radius: 20px;
    background: #181b25;
    padding: 20px;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    width: 48.3%;
    height: auto;
    @media (max-width: 1440px) {
      width: 48%;
    }
    @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
      width: 100%;
      padding: 12px;
      gap: 12px;
    }

    color: #fff;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 30px;

    .icon {
      border-radius: 14px;
      border: 1px solid #494b53;
      display: flex;
      padding: 13px;
      justify-content: center;
      align-items: center;

      img,
      svg {
        width: 24px;
        height: 24px;
      }
    }

    p {
      padding: 0;
      margin: 0;
    }
  }
`
const DFPSection = () => {
  const isMobile = useIsMobile()

  return (
    <SectionLayout>
      <SectionCol>
        <FlexContainer style={{ width: '100%' }}>
          <RowToCol>
            <FirstBlock>
              <div className="badge">DFP token</div>
              <h2>Get up to 30% discount with DFP token on:</h2>
              <p>
                The DFP token is central to the DeFi Pool ecosystem, powering its functions and offering benefits to
                both B2B and B2C customers.
              </p>
            </FirstBlock>
            {isMobile ? (
              <LinksBlock>
                {firstBlockLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.link}
                    style={{
                      pointerEvents: link.disabled ? 'none' : 'auto',
                      opacity: link.disabled ? '0.5' : '1',
                    }}
                  >
                    <img src="/images/landing/icons/DFPsection/link_icon.svg" alt="link icon" />
                    <p>{link.title}</p>
                  </Link>
                ))}
              </LinksBlock>
            ) : null}
            <DfpImage src="/images/landing/dfp_image.webp" alt="DFP token" />
            {!isMobile ? (
              <LinksBlock>
                {firstBlockLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.link}
                    style={{
                      pointerEvents: link.disabled ? 'none' : 'auto',
                      opacity: link.disabled ? '0.5' : '1',
                    }}
                  >
                    <img src="/images/landing/icons/DFPsection/link_icon.svg" alt="link icon" />
                    <p>{link.title}</p>
                  </Link>
                ))}
              </LinksBlock>
            ) : null}
          </RowToCol>
          <RowToCol>
            <SecondBlock>
              {secondBlockLinks.map((link) => (
                <div className="block" key={link.title}>
                  <div className="icon">
                    <img src={link.icon} alt={link.title} />
                  </div>
                  <p>{link.title}</p>
                </div>
              ))}
            </SecondBlock>
          </RowToCol>
        </FlexContainer>
      </SectionCol>
    </SectionLayout>
  )
}
const firstBlockLinks = [
  {
    title: 'One pager',
    link: 'https://www.google.com',
    disabled: true,
  },
  {
    title: 'Whitepaper',
    link: 'https://www.google.com',
    disabled: true,
  },
  {
    title: 'Pitch deck',
    link: 'https://www.google.com',
    disabled: true,
  },
  {
    title: 'Tokemomics',
    link: 'https://www.google.com',
    disabled: true,
  },
]
const secondBlockLinks = [
  {
    title: 'Predictions',
    icon: '/images/landing/icons/DFPsection/1.svg',
  },
  {
    title: 'Trading fees',
    icon: '/images/landing/icons/DFPsection/2.svg',
  },
  {
    title: 'Margin trading',
    icon: '/images/landing/icons/DFPsection/3.svg',
  },
  {
    title: 'Yield Farming solutions',
    icon: '/images/landing/icons/DFPsection/4.svg',
  },
  {
    title: 'Premium and pro-level subscriptions',
    icon: '/images/landing/icons/DFPsection/5.svg',
  },
  {
    title: 'Affiliate and Referral Programs',
    icon: '/images/landing/icons/DFPsection/6.svg',
  },
  {
    title: 'Token listing',
    icon: '/images/landing/icons/DFPsection/7.svg',
  },
  {
    title: 'AMM for external projects',
    icon: '/images/landing/icons/DFPsection/8.svg',
  },
  {
    title: 'Paid API access',
    icon: '/images/landing/icons/DFPsection/9.svg',
  },
  {
    title: 'White-label solutions',
    icon: '/images/landing/icons/DFPsection/10.svg',
  },
  {
    title: 'Advertising and partnerships',
    icon: '/images/landing/icons/DFPsection/11.svg',
  },
  {
    title: 'Learn2Earn collaborations',
    icon: '/images/landing/icons/DFPsection/12.svg',
  },
]

export default DFPSection
