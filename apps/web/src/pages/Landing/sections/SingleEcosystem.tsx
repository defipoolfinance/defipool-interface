import styled from 'styled-components'
import { ReactComponent as SecondIcon } from '../../../assets/svg/landing-ecosystem/2i.svg'
import { ReactComponent as ThirdIcon } from '../../../assets/svg/landing-ecosystem/3i.svg'
import { H2 } from '../components/Generics'
import { Card, CardWithHeader } from '../components/blocks/CardWithHeader'
import GasOptimized from '../components/blocks/GasOptimized'

const SectionLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0;
  max-width: 93vw;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.xxm}px`}) {
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

  @media (max-width: ${({ theme }) => `${theme.breakpoint.xxm}px`}) {
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

  gap: 14px;
`
const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.xxm}px`}) {
    flex-direction: column;
  }
`
const Title = styled(H2)`
  width: 100%;
  text-align: center;
  margin: 0;
  margin-bottom: 40px;
  font-size: 48px;
  font-style: normal;
  font-weight: 600;
  line-height: 52px;
  font-family: Inter;

  @media (max-width: ${({ theme }) => `${theme.breakpoint.xxm}px`}) {
    text-align: left;
    margin-bottom: 24px;
    font-size: 32px;
    font-weight: 500;
    line-height: 40px;
  }
`
const SingleEcosystem = () => {
  return (
    <SectionLayout>
      <SectionCol>
        <Title>All your desires in a single ecosystem</Title>
        <FlexContainer style={{ width: '100%' }}>
          <RowToCol>
            <CardWithHeader
              img={<ThirdIcon />}
              title={
                <>
                  Direct <span>cost access</span>
                </>
              }
              card={{
                title: 'Analyse',
                desc: (
                  <>
                    Market with up-to-date <span>Analytics</span>
                  </>
                ),
                bg_img: '/images/landing/bloks/1.webp',
              }}
            />
            <GasOptimized />
          </RowToCol>
          <RowToCol>
            <Card
              height="350px"
              title="Earn"
              bg_img="/images/landing/bloks/2.webp"
              desc={
                <>
                  Providing liquidity in our <span>Pool</span>
                </>
              }
            />
            <CardWithHeader
              img={<SecondIcon />}
              title={
                <>
                  No addictional <span>fees</span>
                </>
              }
              card={{
                title: 'Trade',
                desc: (
                  <>
                    With a user-friendly decentralized <span>Swap</span>
                  </>
                ),
                bg_img: '/images/landing/bloks/4.webp',
                height: '329px',
              }}
            />
          </RowToCol>
        </FlexContainer>
      </SectionCol>
    </SectionLayout>
  )
}

export default SingleEcosystem
