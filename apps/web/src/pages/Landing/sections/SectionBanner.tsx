import styled from 'styled-components'
import { showDeprecated } from '../../../utils/showDeprecated'
import { Box } from '../components/Generics'

const ImagePhone = styled.img`
  position: absolute;
  right: 126px;
  bottom: 0px;
  // contain
  width: 50%;
  height: auto;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: 100%;
    right: 0;
    bottom: 0;
  }
`
const SectionLayout = styled(Box)<{ bg: string }>`
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 96px 47px 106px 77px;
  max-width: 93vw;
  border-radius: 21.782px;

  background: url(${({ bg }) => bg}), linear-gradient(132deg, #1324ee -4.92%, #0b1588 286.53%);
  background-size: cover;
  background-position: bottom right;
  background-repeat: no-repeat;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    background-size: cover;
    background-position: bottom right;
    background-repeat: no-repeat;
    padding: 32px 16px 290px 16px;
    max-width: 90vw;
    width: 90vw;
    margin: 0 8px;
  }
  // @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
  //   background-size: cover;
  //   background-position: bottom left;
  // }
  // @media (max-width: ${({ theme }) => `${theme.breakpoint.xs}px`}) {
  //   background-size: cover;
  // }
`
const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 420px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: 100%;
  }
  font-family: Inter;

  h2 {
    margin: 0;
    margin-bottom: 18px;
    color: #fff;
    font-style: normal;
    font-size: 52px;
    font-weight: 600;
    line-height: 62px;
    @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
      font-size: 48px;
      font-weight: 600;
    }
  }
  @media (max-width: ${({ theme }) => `${theme.breakpoint.lg}px`}) {
    width: 341px;
  }
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: fit-content;
  }
  p {
    margin: 0;
    margin-bottom: 29px;
    color: #fff;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
`
const BannerButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: fit-content;
  border-radius: 100px;
  background: #fff;
  font-feature-settings: 'clig' off, 'liga' off;
  transition: ${({ theme }) => theme.transition.duration.medium};
  padding: 14px 36px;
  color: #14151d;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;

  :hover {
    opacity: ${({ theme }) => theme.opacity.hover};
  }
`
const SectionBanner = () => {
  return (
    <SectionLayout bg="/images/landing/e-gates.webp">
      <ImagePhone src="/images/landing/Phone.webp" />
      <BannerContent>
        <h2>DeFi Pool</h2>
        <p>Matcha finds you the best prices across exchanges and combines them into one trade.</p>
        {showDeprecated ? <BannerButton>Learn more</BannerButton> : null}
      </BannerContent>
    </SectionLayout>
  )
}

export default SectionBanner
