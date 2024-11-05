import styled from 'styled-components'
import { ProductCard, TextCard } from '../components/products/ProductCard'

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
  align-items: stretch;

  gap: 14px;
`
const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    flex-direction: column;
  }
`
const ProductsBlocks = () => {
  return (
    <SectionLayout>
      <SectionCol>
        <FlexContainer style={{ width: '100%' }}>
          <RowToCol>
            <TextCard
              badge="About"
              title="Why use one exchange when you can use them all?"
              description="Matcha aggregates all the offers from various liquidity sources"
            />
            <ProductCard
              icon="/images/landing/products/order_icon.svg"
              title="Order book"
              description="Free limit orders"
              link={undefined}
              card_bg="/images/landing/products/bg/Card_2.webp"
            />
          </RowToCol>
          <RowToCol>
            <ProductCard
              icon="/images/landing/products/privacy_icon.svg"
              title="Private liquidity"
              description="Exclusive to DEX"
              link={undefined}
              card_bg="/images/landing/products/bg/Card_1.webp"
            />
            <ProductCard
              icon="/images/landing/products/payments_icon.svg"
              title="Market makers"
              description="Through 0x’s RFQ system"
              link={undefined}
              card_bg="/images/landing/products/bg/Card_3.webp"
            />
          </RowToCol>
        </FlexContainer>
      </SectionCol>
    </SectionLayout>
  )
}

export default ProductsBlocks
