import { FC } from 'react'
import styled from 'styled-components'

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 14px;
`
const CardHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  width: 100%;
  gap: 20px;
  padding: 30px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.xxm}px`}) {
    padding: 20px;
  }

  border-radius: 17.869px;
  background: linear-gradient(205deg, rgba(70, 91, 255, 0.2) -40.37%, rgba(18, 58, 160, 0) 98.97%);
  backdrop-filter: blur(20px);

  img,
  svg {
    width: 68px;
    height: 68px;
    min-width: 68px;
    min-height: 68px;
    max-width: 68px;
    max-height: 68px;
    margin: 0;
    background-color: #1324ee;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
`

const CardBody = styled.div<{ height?: string; bg_img?: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 30px;
  border-radius: 18px;
  backdrop-filter: blur(20px);
  height: ${({ height }) => height || '272.414px'};
  background: ${({ bg_img }) =>
    bg_img
      ? `url(${bg_img}),linear-gradient(205deg, rgba(70, 91, 255, 0.2) -40.37%, rgba(18, 58, 160, 0) 98.97%)`
      : 'none,linear-gradient(205deg, rgba(70, 91, 255, 0.2) -40.37%, rgba(18, 58, 160, 0) 98.97%)'};
  background-size: cover;
  background-position: bottom center;
  background-repeat: no-repeat;
  min-height: auto;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.xxm}px`}) {
    height: 300px;
    background-size: contain;
    background-position: right bottom;
  }
  @media (max-width: 1023px) {
    min-height: 450px;
  }
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    min-height: 390px;
  }
  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    background-size: contain;
    min-height: 320px;
  }
`
const CardBodyText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  max-width: 160px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.xxm}px`}) {
    max-width: 100%;
  }
`
const CardBodyTextTitle = styled.p`
  color: #fff;
  text-align: center;
  /* 🚀 𝗟𝗮𝗻𝗱𝗶𝗻𝗴 𝗡𝗲𝘄 𝗦𝘁𝘆𝗹𝗲𝘀/H5 */
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 34px;
  margin: 0;
`
const CardBodyTextDesc = styled.p`
  color: #b4b4b4;
  font-feature-settings: 'clig' off, 'liga' off;
  /* 🚀 𝗟𝗮𝗻𝗱𝗶𝗻𝗴 𝗡𝗲𝘄 𝗦𝘁𝘆𝗹𝗲𝘀/Md Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin: 0;

  span {
    color: #fff;
  }
`
const CardHeaderTitle = styled.h3`
  color: #fff;
  /* 🚀 𝗟𝗮𝗻𝗱𝗶𝗻𝗴 𝗡𝗲𝘄 𝗦𝘁𝘆𝗹𝗲𝘀/Lg Semi Bold */
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px; /* 150% */
  width: 100%;

  span {
    color: #b4b4b4;
  }
`
const CardHeaderImage = styled.img`
  width: 68px;
  height: 68px;
`

interface ICardWithHeader {
  img?: string | JSX.Element
  title: string | JSX.Element
  card: ICardProps
}

const CardWithHeader = ({ img, title, card }: ICardWithHeader) => {
  return (
    <CardWrapper>
      <CardHeader>
        {img ? <>{typeof img === 'string' ? <CardHeaderImage src={img} alt="card header image" /> : img}</> : null}
        <CardHeaderTitle>{title}</CardHeaderTitle>
      </CardHeader>
      <Card {...card} />
    </CardWrapper>
  )
}

const Card: FC<ICardProps> = ({ title, desc, bg_img, ...props }) => (
  <CardBody {...props} bg_img={bg_img}>
    <CardBodyText>
      <CardBodyTextTitle>{title}</CardBodyTextTitle>
      <CardBodyTextDesc>{desc}</CardBodyTextDesc>
    </CardBodyText>
  </CardBody>
)

interface ICardProps {
  title: string | JSX.Element
  desc: string | JSX.Element
  height?: string
  bg_img?: string
}

// eslint-disable-next-line import/no-unused-modules
export { Card, CardWithHeader }
