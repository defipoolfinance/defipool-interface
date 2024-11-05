import styled from 'styled-components'

import Row from '../../Row'

export const Input = styled.input`
  width: 100%;
  display: flex;
  flex: 1;
  font-size: 16px;
  border: 0;
  outline: none;
  background: transparent;
  text-align: right;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  ::placeholder {
    color: ${({ theme }) => theme.neutral3};
  }
`

export const InputContainer = styled(Row)<{ error?: boolean }>`
  padding: 8px 16px;
  width: auto;
  min-width: 100px;
  flex: 1;
  input {
    color: ${({ theme, error }) => (error ? theme.critical : theme.neutral1)};
    height: 50px;
    text-align: left;
  }
  background-color: ${({ theme }) => theme.accent7};
  border-radius: 10px;
  ${({ theme, error }) =>
    error
      ? `
        border: 1px solid ${theme.critical};
        :focus-within {
          border-color: ${theme.deprecated_accentFailureSoft};
        }
      `
      : `
        border: 1px solid ${theme.accent6};
        :focus-within {
          border-color: ${theme.accent6};
        }
      `};
`
