import styled from 'styled-components'
import { ReactComponent as ThirdIcon } from '../../../../assets/svg/landing-ecosystem/3i.svg'

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  gap: 14px;
  height: 405px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    flex-direction: column;
    height: auto;
  }
`
const CardImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 17.869px;
  background: linear-gradient(40deg, rgba(70, 91, 255, 0.2) -11.74%, rgba(18, 58, 160, 0) 111.05%);
  backdrop-filter: blur(19.899999618530273px);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 384px;
    height: 414px;
    object-fit: contain;
    border-radius: 17.869px;
  }
`

const CardInfo = styled.div`
  display: flex;
  width: 212px;
  padding: 122px 12.793px 122.793px 13px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;
  gap: 20px;
  color: #fff;
  text-align: center;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: 100%;
    padding: 20px;
    justify-content: center;
    flex-direction: column;
    text-align: center;
  }
  font-feature-settings: 'clig' off, 'liga' off;
  border-radius: 17.869px;
  background: linear-gradient(205deg, rgba(70, 91, 255, 0.2) -40.37%, rgba(18, 58, 160, 0) 98.97%);
  backdrop-filter: blur(19.899999618530273px);

  /* 🚀 𝗟𝗮𝗻𝗱𝗶𝗻𝗴 𝗡𝗲𝘄 𝗦𝘁𝘆𝗹𝗲𝘀/Lg Semi Bold */

  p {
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 30px; /* 150% */
    margin: 0;

    span {
      color: #b4b4b4;
      font-feature-settings: 'clig' off, 'liga' off;

      /* 🚀 𝗟𝗮𝗻𝗱𝗶𝗻𝗴 𝗡𝗲𝘄 𝗦𝘁𝘆𝗹𝗲𝘀/Lg Regular */
      font-family: Inter;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      margin: 0;
      line-height: 30px;
    }
  }
`
const CardInfoIcon = styled.div`
  img,
  svg {
    width: 68.965px;
    height: 68.965px;
    min-width: 68.965px;
    min-height: 68.965px;
    max-width: 68.965px;
    max-height: 68.965px;

    margin: 0;
    background-color: #1324ee;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
`
const GasOptimized = () => {
  return (
    <CardWrapper>
      <CardImageWrapper>
        {/*bg_img: '/images/landing/bloks/1.png',*/}
        <img src="/images/landing/bloks/3.webp" alt="Gas Optimized" />
      </CardImageWrapper>
      <CardInfo>
        <CardInfoIcon>
          <ThirdIcon />
        </CardInfoIcon>
        <p>
          Optimized <span>gas efficiency</span>
        </p>
      </CardInfo>
    </CardWrapper>
  )
}

export default GasOptimized
