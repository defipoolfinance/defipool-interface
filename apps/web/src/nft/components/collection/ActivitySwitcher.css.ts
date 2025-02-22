import { style } from '@vanilla-extract/css'
import { buttonTextMedium } from 'nft/css/common.css'
import { loadingAsset } from 'nft/css/loading.css'
import { sprinkles, vars } from 'nft/css/sprinkles.css'

export const baseActivitySwitcherToggle = style([
  buttonTextMedium,
  sprinkles({
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '8',
  }),
  {
    lineHeight: '24px',
  },
])

export const activitySwitcherToggle = style([
  baseActivitySwitcherToggle,
  sprinkles({
    color: 'neutral2',
  }),
])

export const selectedActivitySwitcherToggle = style([
  baseActivitySwitcherToggle,
  sprinkles({
    color: 'neutral1',
  }),
  {
    ':after': {
      content: '',
      position: 'absolute',
      background: vars.color.neutral1,
      width: '100%',
      height: '2px',
      left: '0',
      right: '0',
      bottom: '-9px',
    },
  },
])

export const styledLoading = style([
  loadingAsset,
  {
    width: 58,
    height: 20,
  },
])
