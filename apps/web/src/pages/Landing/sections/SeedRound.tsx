import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { H2 } from '../components/Generics'

const SectionLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 93vw;
  border-radius: 20px;
  background: #181b25;
  padding: 48px 0 0;

  justify-content: flex-start;
  align-items: center;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding: 20px 16px;
  }
  font-family: Inter;
`

const Title = styled(H2)`
  width: 100%;
  margin: 0;
  margin-bottom: 42px;
  padding-right: 48px;
  padding-left: 48px;

  color: #fff;
  font-size: 48px;
  font-style: normal;
  font-weight: 600;
  line-height: 52px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    margin-bottom: 16px;
    padding-right: 0;
    padding-left: 0;
    font-size: 32px;
    font-weight: 500;
    line-height: 40px;
  }
`
const SeedBlocks = styled.div`
  padding-right: 48px;
  padding-left: 48px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  flex-direction: row;
  width: 100%;
  gap: 20px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    gap: 8px;
    flex-wrap: wrap;
    padding-right: 0;
    padding-left: 0;
  }

  .block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    //width: 100%;
    padding: 20px;
    border-radius: 8px;
    background: #20242f;
    width: 24%;
    @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
      width: 48%;
    }

    .icon {
      display: flex;
      width: 36px;
      height: 36px;
      padding: 9px;
      justify-content: center;
      align-items: center;
      border-radius: 100px;
      background: #1324ee;
      margin-bottom: 16px;
      @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
        margin-bottom: 3px;
      }

      img {
        width: 18px;
        height: 18px;
      }
    }

    h3 {
      color: #d1d0d3;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin: 0;
      padding: 0;
      margin-bottom: 4px;

      @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
        color: #b4b4b4;
        font-size: 16px;
      }
    }

    p {
      margin: 0;
      padding: 0;
      color: #fff;
      font-size: 26px;
      font-style: normal;
      font-weight: 600;
      line-height: 36px;

      @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
        font-size: 20px;
        line-height: 30px;
      }
    }

    &:last-of-type {
      background: #1324ee;

      .icon {
        background: #fff;
      }

      h3 {
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
      }

      .arr_btn {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 16px;

        color: #fff;
        font-family: Inter;
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 30px;
        @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
        }
      }
    }
  }
`
const SeedRound = () => {
  return (
    <SectionLayout>
      <Title>Seed Round already started!</Title>
      <SeedBlocks>
        {seedBlocks.map((block, index) => (
          <div className="block" key={index}>
            <div className="icon">
              <img src={`/images/landing/seed-round/icons/${index + 1}.svg`} alt="icon" />
            </div>
            <h3>{block.title}</h3>
            {seedBlocks.length - 1 !== index ? (
              <p>{block.value}</p>
            ) : (
              <div
                className="arr_btn"
                onClick={() => {
                  window.open('https://app.defiforyou.uk/', '_blank')
                }}
              >
                <span>{block.value}</span>
                <img src="/images/landing/seed-round/icons/arrow.svg" alt="arrow" />
              </div>
            )}
          </div>
        ))}
      </SeedBlocks>
      <CollectedLineComponent />
    </SectionLayout>
  )
}
const CollectedLine = styled.div`
  margin-top: 48px;
  border-radius: 8px;
  background: #20242f;
  display: flex;
  width: 100%;
  padding: 20px 48px;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-direction: row;
  font-family: Inter;

  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    gap: 32px;
    flex-direction: column;
    padding: 16px;
    justify-content: center;
    align-items: center;
    div {
      position: relative;
      width: 100%;

      &:not(:last-of-type) {
        &:after {
          content: '';
          display: block;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.13);
          position: absolute;
          bottom: -16px;
          left: 0;
        }
      }
    }
  }
}

p {
  color: #b4b4b4;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  margin: 0;
  padding: 0;
}

span {
  margin: 0;
  padding: 0;
}

.completed {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  align-items: center;

  span {
    display: flex;
    padding: 4px 18px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 900px;
    background: #1324ee;

    color: #fff;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 34px;
  }
}

.time {
  display: flex;
  justify-content: flex-start;

  flex-direction: column;
  gap: 6px;
  align-items: center;

  span {
    white-space: nowrap;
    display: flex;
    padding: 4px 18px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 900px;
    background: #1324ee;
    width: 196px;
    max-width: 196px;
    min-width: 196px;
    color: #fff;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
  }
}
`
const Line = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  width: 100%;

  span {
    color: #fff;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 30px;
  }

  .line_container {
    display: flex;
    margin-top: 10px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    align-self: stretch;
    background: rgba(255, 255, 255, 0.25);
    height: 12px;
    border-radius: 100px;

    .line_fill {
      width: 226px;
      height: 12px;
      border-radius: 100px;
      background: linear-gradient(132deg, #1324ee -4.92%, #0b1588 286.53%);
    }
  }
`
const CollectedLineComponent = () => {
  return (
    <CollectedLine>
      <div className="completed">
        <p>Completed</p>
        <span>70%</span>
      </div>
      <Line className="line">
        <p>Collected</p>
        <span>19,828,92 CRT</span>
        <div className="line_container">
          <div className="line_fill" />
        </div>
      </Line>
      <div className="time">
        <p>Before the close of trading</p>
        <Timer />
      </div>
    </CollectedLine>
  )
}
const Timer = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const end = new Date('2024-08-25')
      const diff = +end - +now
      // add days if needed
      const days = Math.floor(diff / 1000 / 60 / 60 / 24)
      const hours = Math.floor((diff / 1000 / 60 / 60) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      setTime({ days, hours, minutes, seconds })
      if (diff < 0) clearInterval(interval)
      if (hours === 0 && minutes === 0 && seconds === 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <span>
      {
        // add days if needed
        time.days > 0 ? `${time.days}d : ` : ''
      }
      {time.hours?.toString().length === 1 ? `0${time.hours}` : time.hours}h :{' '}
      {time.minutes?.toString().length === 1 ? `0${time.minutes}` : time.minutes}min :{' '}
      {time.seconds?.toString().length === 1 ? `0${time.seconds}` : time.seconds}sec
    </span>
  )
}
const seedBlocks = [
  {
    title: 'DFP price',
    value: '$0.015',
  },
  {
    title: 'Allocation',
    value: '26 250 000',
  },
  {
    title: 'Min tokens',
    value: '10 000',
  },
  {
    title: '70% off',
    value: 'Buy DFP',
  },
]

export default SeedRound
