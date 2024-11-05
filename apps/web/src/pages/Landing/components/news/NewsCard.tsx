import { FC } from 'react'
import styled from 'styled-components'
import { ArrButton } from '../../../../components/Button/ArrButton'
// import { INews } from '../../sections/LatestNews'

const NewsCardInner = styled.div`
  background-color: #20242f;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0;
  overflow: hidden;
  height: fit-content;
  width: 400px;
  min-width: 400px;
  max-width: 400px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    border-radius: 20px;
    width: 280px;
    min-width: 280px;
    max-width: 280px;
  }
  @media (max-width: ${({ theme }) => `${theme.breakpoint.xsl}px`}) {
    //border-radius: 20px !important;
    //width: 100% !important;
    //min-width: 100% !important;
    //max-width: 100% !important;
  }

  .card-content {
    height: 275px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 30px 20px;
    background-color: #181b25;
    @media (max-width: ${({ theme }) => `${theme.breakpoint.xsl}px`}) {
      height: fit-content;
      //padding: 0px;
    }
  }

  .link-block {
    display: flex;
    width: 100%;
    padding: 32px;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    background-color: #20242f;
    height: fit-content;
    @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
      padding: 16px;
    }
  }
`
// const NewsCard: FC<INews> = ({ text, content }) => {
const NewsCard: FC<any> = ({ text, content }) => {
  return (
    <NewsCardInner>
      <div className="card-content">
        {content ? content : null}
        {text ? <p>{text}</p> : null}
      </div>
      <div className="link-block">
        <ArrButton
          size="medium"
          color="#FFF"
          style={{
            fontSize: '20px',
          }}
        >
          Read more
        </ArrButton>
      </div>
    </NewsCardInner>
  )
}

export default NewsCard
