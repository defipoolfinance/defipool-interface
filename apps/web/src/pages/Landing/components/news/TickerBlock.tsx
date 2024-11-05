import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useIsMobile } from '../../../../nft/hooks'

const Outer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-width: 100%;
  max-width: 100vw;
  height: auto;
  padding: 0px 0;
  margin: 0;
  overflow: hidden;

  > .inner {
    margin: 0;

    display: flex;
    flex-direction: row;
    gap: 24px;
    justify-content: flex-start;
    width: 100%;
    height: auto;
    margin-right: 24px;
    transform: translateX(calc(100vw));
    overflow: visible;
    animation: animateContainer 1s linear forwards infinite;
    animation-play-state: paused;
    @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
      gap: 25px;
      margin-right: 0;
    }
  }

  @keyframes animateContainer {
    from {
      transform: translateX(calc(-15vw));
    }

    to {
      transform: translateX(calc(-98%));
    }
  }
`

interface ITickerBlock {
  items: any[]
  speed?: number
  animationDirection?: 'normal' | 'reverse'
  RenderItem: React.FC<any>
}

const TickerBlock = ({ items, speed = 1000000, animationDirection = 'normal', RenderItem }: ITickerBlock) => {
  const ref = useRef(null)
  const [containerWidth, setWidth] = useState(`${100}%`)
  const [animationState, setPlay] = useState('paused')
  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      setWidth(`${ref.current.scrollWidth - 650}px`)
      setPlay('running')
    }
  }, [])
  const isMobile = useIsMobile()
  const oneTousandElements = Array.from({ length: 30 }, (_, i) => items[i % items.length])
  const renderCards = oneTousandElements.map((el, index) => {
    return <RenderItem key={index} {...el} />
  })

  return (
    <Outer
      onMouseEnter={!isMobile ? () => setPlay('paused') : undefined}
      onMouseLeave={!isMobile ? () => setPlay('running') : undefined}
    >
      <div
        className="inner"
        ref={ref}
        style={{
          width: `${containerWidth}`,
          animationPlayState: animationState,
          animationDuration: `${speed}ms`,
          animationDelay: '0s',
          animationIterationCount: 'infinite',
          transform: animationDirection !== 'reverse' ? 'translateX(0)' : 'translateX(-100%)',
          animationDirection,
        }}
      >
        {renderCards}
      </div>
    </Outer>
  )
}
export default TickerBlock
