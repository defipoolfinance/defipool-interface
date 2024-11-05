import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { Z_INDEX } from 'theme/zIndex'

interface BodyWrapperProps {
  $margin?: string
  $maxWidth?: string
}

export const BodyWrapper = styled.main<BodyWrapperProps>`
  position: relative;
  // margin-top: ${({ $margin }) => $margin ?? '0'};
  max-width: 640px;
  width: 100%;
  min-width: 640px;
  @media (max-width: 640px) {
    min-width: 100%;
    max-width: 100%;
  }
  background-color: ${({ theme }) => theme.surface7};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.surface3};
  margin-top: 1rem !important;
  margin-left: auto;
  margin-right: auto;
  z-index: ${Z_INDEX.default};
  padding: 0 !important;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody(props: PropsWithChildren<BodyWrapperProps>) {
  return <BodyWrapper {...props} />
}
