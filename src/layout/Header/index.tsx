import { Button, Box, NetworkSelection } from '@kalycoinproject/components'
import React, { useContext, useState, useRef } from 'react'
import { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { CardNoise } from '../../components/earn/styled'
import Web3Status from '../../components/Web3Status'
import Modal from '../../components/Modal'
import KswapBalanceContent from './KswapBalanceContent'
import LanguageSelection from '../../components/LanguageSelection'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useDarkModeManager } from '../../state/user/hooks'
import NightMode from '../../assets/svg/nightMode.svg'
import LightMode from '../../assets/svg/lightMode.svg'
import {
  HeaderFrame,
  HeaderControls,
  HeaderElement,
  HeaderElementWrap,
  AccountElement,
  KSWAPAmount,
  KSWAPWrapper,
  NetworkCard,
  BalanceText,
  ThemeMode,
  MobileHeader,
  FooterMobileControls,
  MobileLogoWrapper,
  LegacyButtonWrapper
} from './styled'
import { useTranslation } from 'react-i18next'
import MobileFooter from '../MobileFooter'
import { Logo } from '../../components/Icons'
import { Hidden, MEDIA_WIDTHS } from 'src/theme'
import { useChainId } from 'src/hooks'
import { NETWORK_CURRENCY, NETWORK_LABELS } from 'src/constants'
import { useMedia } from 'react-use'

export default function Header() {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const userEthBalance = useETHBalances(chainId, account ? [account] : [])?.[account ?? '']

  const [showKswapBalanceModal, setShowKswapBalanceModal] = useState(false)
  const [openNetworkSelection, setOpenNetworkSelection] = useState(false)

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.FARM)
  const toggle = useToggleModal(ApplicationModal.FARM)
  useOnClickOutside(node, open ? toggle : undefined)

  const [isDark, toggleDarkMode] = useDarkModeManager()

  const closeNetworkSelection = () => {
    setOpenNetworkSelection(false)
  }

  const isMobile = useMedia(`(max-width: ${MEDIA_WIDTHS.upToSmall}px)`)

  return (
    <HeaderFrame>
      <Modal isOpen={showKswapBalanceModal} onDismiss={() => setShowKswapBalanceModal(false)}>
        {showKswapBalanceModal && <KswapBalanceContent setShowKswapBalanceModal={setShowKswapBalanceModal} />}
      </Modal>
      {isMobile && (
        <MobileHeader>
          <MobileLogoWrapper>
            <Logo height={30} width={140} fillColor={theme.color6} />
          </MobileLogoWrapper>

          <Box display="flex" alignItems="center">
            <Web3Status />

            <ThemeMode onClick={() => toggleDarkMode()}>
              {isDark ? (
                <img width={'16px'} src={LightMode} alt={'Setting'} />
              ) : (
                <img width={'16px'} src={NightMode} alt={'NightMode'} />
              )}
            </ThemeMode>
          </Box>
        </MobileHeader>
      )}

      <FooterMobileControls>
        <MobileFooter />
      </FooterMobileControls>

      <HeaderControls>
        <HeaderElement>
          <LegacyButtonWrapper>
            <Button variant="primary" height={36} padding="4px 6px" href="/" as="a">
              <span style={{ whiteSpace: 'nowrap', color: '#000' }}>{t('header.returnToLegacySite')}</span>
            </Button>
          </LegacyButtonWrapper>
          <Hidden upToSmall={true}>
            <NetworkSelection open={openNetworkSelection} closeModal={closeNetworkSelection} />
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard
                title={NETWORK_LABELS[chainId]}
                onClick={() => setOpenNetworkSelection(!openNetworkSelection)}
              >
                {NETWORK_LABELS[chainId]}
              </NetworkCard>
            )}
          </Hidden>
          <KSWAPWrapper onClick={() => setShowKswapBalanceModal(true)}>
            <KSWAPAmount active={!!account} style={{ pointerEvents: 'auto' }}>
              KSWAP
            </KSWAPAmount>
            <CardNoise />
          </KSWAPWrapper>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} {NETWORK_CURRENCY[chainId]}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <LanguageSelection isBeta={true} />
          <ThemeMode onClick={() => toggleDarkMode()}>
            {isDark ? (
              <img width={'16px'} src={LightMode} alt={'Setting'} />
            ) : (
              <img width={'16px'} src={NightMode} alt={'NightMode'} />
            )}
          </ThemeMode>
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
