import { css, keyframes } from 'styled-components'

export const flexColumnNoWrap = css`
  display: flex;
  flex-flow: column nowrap;
`
export const scrollStyle = css`
  scrollbar-width: thin;
  scrollbar-color: #4b4b4b #14151d;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4b4b4b;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #14151d;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #4b4b4b;
  }

  &::-webkit-scrollbar-thumb:active {
    background-color: #4b4b4b;
  }

  &::-webkit-scrollbar-corner {
    background-color: #14151d;
  }
`
export const flexRowNoWrap = css`
  display: flex;
  flex-flow: row nowrap;
`

export enum TRANSITION_DURATIONS {
  slow = 500,
  medium = 250,
  fast = 125,
}

const transitions = {
  duration: {
    slow: `${TRANSITION_DURATIONS.slow}ms`,
    medium: `${TRANSITION_DURATIONS.medium}ms`,
    fast: `${TRANSITION_DURATIONS.fast}ms`,
  },
  timing: {
    ease: 'ease',
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const textFadeIn = css`
  animation: ${fadeIn} ${transitions.duration.fast} ${transitions.timing.in};
`

const slideDown = keyframes`
from {
  transform: translateY(-20px);
  opacity: 0;
}
to {
  transform: translateY(0);
  opacity: 1;
}
`

export const dropdownSlideDown = css`
  animation: ${slideDown} ${transitions.duration.fast} ${transitions.timing.inOut};
`
