import React from 'react'
import styled from 'styled-components'

const KswapToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 7px;
  background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.primary1 : theme.text4) : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text3)};
  font-size: 1rem;
  font-weight: 400;

  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.text6 : theme.text4) : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.text1 : theme.text2) : theme.text2)};
  font-size: 1rem;
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? '500' : '400')};
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
    background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.text6 : theme.text3) : 'none')};
    color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.text1 : theme.text2) : theme.text3)};
  }
`

const StyledKswapToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 6px;
  border: none;
  /* border: 1px solid ${({ theme, isActive }) => (isActive ? theme.primary5 : theme.text4)}; */
  background: ${({ theme }) => theme.bg3};
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0;
  height: 100%;
  padding: 1px;
`

export interface KswapToggleProps {
  id?: string
  isActive: boolean
  toggle: (e: boolean) => void
  leftLabel: string
  rightLabel: string
}

export default function KswapToggle({ id, isActive, toggle, leftLabel, rightLabel }: KswapToggleProps) {
  return (
    <StyledKswapToggle id={id} isActive={isActive} onClick={() => toggle(!isActive)}>
      <KswapToggleElement isActive={isActive} isOnSwitch={false}>
        {leftLabel}
      </KswapToggleElement>
      <KswapToggleElement isActive={!isActive} isOnSwitch={true}>
        {rightLabel}
      </KswapToggleElement>
    </StyledKswapToggle>
  )
}
