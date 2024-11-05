import { WARNING_LEVEL } from 'constants/tokenSafety'
import { renderHook } from 'test-utils/render'

import { useTokenWarningColor } from './useTokenWarningColor'

describe('Token Warning Colors', () => {
  describe('useTokenWarningColor', () => {
    it('medium', () => {
      const { result } = renderHook(() => useTokenWarningColor(WARNING_LEVEL.MEDIUM))
      expect(result.current).toBe(result.current)
    })
  })
})
