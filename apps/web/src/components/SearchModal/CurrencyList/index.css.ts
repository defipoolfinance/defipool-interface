import { style } from '@vanilla-extract/css'

export const scrollbarStyle = style([
  {
    scrollbarWidth: 'thin',
    scrollbarColor: `#4b4b4b #14151d`,
    height: '100%',
    selectors: {
      '&::-webkit-scrollbar': {
        background: 'transparent',
        height: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#000',
        borderRadius: '8px',
      },
      // add more selectors here
      '&::-webkit-scrollbar-track': {
        background: '#14151d',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#4b4b4b',
      },
      '&::-webkit-scrollbar-thumb:active': {
        background: '#4b4b4b',
      },
    },
  },
])
