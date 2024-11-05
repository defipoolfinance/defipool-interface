import { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { ReactComponent as SmallArrowLeft } from '../../assets/svg/gray-small-arrow-left.svg'
import { ReactComponent as MiddleArrowLeft } from '../../assets/svg/white-middle-arrow-left.svg'

const ArrButtonBase = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 10px 0;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.duration.medium};
  font-feature-settings: 'clig' off, 'liga' off;
  gap: 10px;

  :hover {
    opacity: ${({ theme }) => theme.opacity.hover};
  }
`

const SmallArrButton = styled(ArrButtonBase)`
  color: ${(props) => props.color || props.theme.neutral1};
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  svg {
    path {
      stroke: ${(props) => props.color || props.theme.neutral1};
    }
  }
`

const MediumArrButton = styled(ArrButtonBase)`
  color: ${(props) => props.color || props.theme.neutral1};
  font-feature-settings: 'clig' off, 'liga' off;
  //font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;

  svg {
    path {
      fill: ${(props) => props.color || props.theme.neutral1};
    }
  }
`

interface IArrButton extends HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium'
  color?: string
  children: ReactNode
}

export const ArrButton = ({ size, children, ...props }: IArrButton) => {
  if (size === 'small') {
    return (
      <SmallArrButton {...props}>
        {children}
        <SmallArrowLeft />
      </SmallArrButton>
    )
  } else if (size === 'medium') {
    return (
      <MediumArrButton {...props}>
        {children}
        <MiddleArrowLeft />
      </MediumArrButton>
    )
  }

  return (
    <MediumArrButton {...props}>
      {children}
      <MiddleArrowLeft />
    </MediumArrButton>
  )
}
