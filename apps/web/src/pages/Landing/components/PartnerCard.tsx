import React, { FC } from 'react'
import styled from 'styled-components'

const PartnerCardInner = styled.div`
  background-color: #181b25;
  border-radius: 20px;
  gap: 0;
  overflow: hidden;
  min-width: 400px;
  max-width: 400px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;
  display: flex;
  width: 377px;
  height: 142px;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    border-radius: 20px;
    width: 280px;
    min-width: 280px;
    max-width: 280px;
  }

  .card-content {
    height: 275px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 30px 20px;
    background-color: #181b25;
  }

  // .link-block {
  //   display: flex;
  //   width: 100%;
  //   padding: 32px;
  //   align-items: flex-start;
  //   justify-content: flex-start;
  //   gap: 10px;
  //   background-color: #20242f;
  //   height: fit-content;
  //   @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
  //     padding: 16px;
  //   }
  // }
`
export interface IPartnerCard {
  text?: string
  content?: React.ReactNode | JSX.Element
  bg_image?: string
  href?: string
}
const PartnerCard: FC<IPartnerCard> = ({ text, content }) => {
  return (
    <PartnerCardInner>
      <div className="card-content">
        {content ? content : null}
        {text ? <p>{text}</p> : null}
      </div>
      {/*<div className="link-block">*/}
      {/*  <ArrButton*/}
      {/*    size="medium"*/}
      {/*    color="#FFF"*/}
      {/*    style={{*/}
      {/*      fontSize: '20px',*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    Read more*/}
      {/*  </ArrButton>*/}
      {/*</div>*/}
    </PartnerCardInner>
  )
}

export default PartnerCard
