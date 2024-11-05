import styled from 'styled-components'
import { ArrButton } from '../../../../components/Button/ArrButton'

const ProductCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  background-color: transparent;
  border-radius: 20px;
  overflow: hidden;
  font-family: Inter;
`
const ProductsTop = styled.div<{ card_bg?: string }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  width: 100%;
  height: 250px;
  gap: 20px;
  padding: 32px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding: 16px;
    height: fit-content;
  }
  background: ${({ card_bg }) => (card_bg ? `url(${card_bg})` : 'none')};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .product_info {
    h3 {
      padding: 0;
      margin: 0;
      color: #fff;
      font-size: 32px;
      font-style: normal;
      font-weight: 500;
      line-height: 40px;
      @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
        font-size: 24px;
        font-weight: 600;
        line-height: 34px;
      }
      margin-bottom: 12px;
    }
    p {
      padding: 0;
      margin: 0;
      color: #b4b4b4;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin-bottom: 32px;
      @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
        margin-bottom: 16px;
      }
    }
  }
  .product_icon {
    border-radius: 20px;
    border: 1px solid #494b53;
    display: flex;
    width: 86px;
    height: 86px;
    padding: 20px;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
    @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
      width: 60px;
      height: 60px;
      padding: 13.953px 13.954px 13.953px 13.953px;
      margin-bottom: 1px;
    }
  }
`

const ProductsBottom = styled.div`
  background: #20242f;
  display: flex;
  padding: 32px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding: 16px;
    *,
    * {
      margin: 0;
      padding: 0;
    }
  }
  justify-content: flex-start;
  width: 100%;
  align-items: flex-start;
`

interface IProductCard {
  title?: string
  description?: string
  icon?: string
  link?: string
  card_bg?: string
}
interface ITextCard extends IProductCard {
  badge?: string
}

const ProductCard = ({ title, description, icon, link, card_bg }: IProductCard) => {
  return (
    <ProductCardWrapper>
      <ProductsTop card_bg={card_bg}>
        <div className="product_info">
          {icon ? (
            <div className="product_icon">
              <img src="/images/landing/products/order_icon.svg" alt="product" />
            </div>
          ) : null}

          {title ? <h3>{title}</h3> : null}
          {description ? <p>Free limit orders</p> : null}
        </div>
      </ProductsTop>
      <ProductsBottom>
        <ArrButton
          onClick={link ? () => window.open(link, '_blank') : () => {}}
          size="medium"
          color="#FFF"
          style={{
            fontSize: '20px',
            fontWeight: 600,
          }}
        >
          Explore
        </ArrButton>
      </ProductsBottom>
    </ProductCardWrapper>
  )
}

const ProductCardInner = styled.div<{ card_bg?: string }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  width: 100%;
  height: 366.47px;
  gap: 20px;
  padding: 32px 0;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding: 0;
  }
  background: ${({ card_bg }) => (card_bg ? `url(${card_bg})` : 'none')};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .product_info {
    max-width: 530px;
    .badge {
      display: flex;
      padding: 6px 18px;
      width: fit-content;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border-radius: 100px;
      background: #1324ee;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      text-transform: uppercase;
      margin-bottom: 32px;

      @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
        margin-bottom: 16px;
        font-size: 12px;
        font-weight: 500;
        line-height: 18px;
      }
    }
    h3 {
      padding: 0;
      margin: 0;
      color: #fff;
      font-family: Inter;
      font-size: 48px;
      font-style: normal;
      font-weight: 600;
      line-height: 52px;
      margin-bottom: 24px;
      @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
        font-size: 32px;
        font-weight: 500;
        line-height: 40px;
        margin-bottom: 16px;
      }
    }
    p {
      padding: 0;
      margin: 0;
      color: #b4b4b4;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px; /* 150% */
    }
  }
`
const TextCard = ({ title, description, badge }: ITextCard) => {
  return (
    <ProductCardWrapper>
      <ProductCardInner>
        <div className="product_info">
          {badge ? <span className="badge">{badge}</span> : null}
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      </ProductCardInner>
    </ProductCardWrapper>
  )
}
export { ProductCard, TextCard }
