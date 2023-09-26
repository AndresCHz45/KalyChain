import { TokenAmount, JSBI, ChainId, CHAINS } from '@kalycoinproject/sdk'
import React, { useMemo, useState } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import tokenLogo from 'src/assets/images/logo.png'
import { injected } from '@kalycoinproject/components'
import { BETA_MENU_LINK, getTokenLogoURL, KALYSWAP_API_BASE_URL } from '../../constants'
import { KSWAP } from '../../constants/tokens'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTotalKswapEarned } from '../../state/stake/hooks'
import { DOUBLE_SIDE_STAKING_REWARDS_CURRENT_VERSION } from '../../state/stake/doubleSideConfig'
import { useAggregateKswapBalance, useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE, KswapTokenAnimated } from '../../theme'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import { useTranslation } from 'react-i18next'
import { useIsBetaUI } from '../../hooks/useLocation'
import useUSDCPrice from '../../utils/useUSDTPrice'
import { useChainId } from 'src/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ffc800 0%, #e1aa00 100%);
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`
const AddKSWAP = styled.span`
  width: 100%;
  height: 100%;
  font-weight: 500;
  font-size: 32;
  padding: 4px 6px;
  align-items: center;
  text-align: center;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ffc800 0%, #e1aa00 100%), #edeef2;
  border-radius: 12px;
  white-space: nowrap;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`

/**
 * Content for balance stats modal
 */
export default function KswapBalanceContent({ setShowKswapBalanceModal }: { setShowKswapBalanceModal: any }) {
  const isBeta = useIsBetaUI()
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const kswap = chainId ? KSWAP[chainId] : undefined

  const total = useAggregateKswapBalance()
  const kswapBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, kswap)
  const kswapToClaim: TokenAmount | undefined = useTotalKswapEarned()

  const totalSupply: TokenAmount | undefined = useTotalSupply(kswap)

  const oneToken = JSBI.BigInt(1000000000000000000)
  const { t } = useTranslation()
  let kswapPrice

  const usdcPriceTmp = useUSDCPrice(kswap)
  const usdcPrice = CHAINS[chainId].mainnet ? usdcPriceTmp : undefined

  if (usdcPrice && kswap) {
    kswapPrice = usdcPrice.quote(new TokenAmount(kswap, oneToken), chainId)
  }

  const [circulation, setCirculation] = useState(totalSupply)

  useMemo(() => {
    if (kswap === undefined) return
    fetch(`${KALYSWAP_API_BASE_URL}/kswap/circulating-supply`)
      .then(res => res.text())
      .then(val => setCirculation(new TokenAmount(kswap, val)))
  }, [kswap])

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage />
        <CardNoise />
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white">{t('header.kswapBreakDown')}</TYPE.white>
            <StyledClose stroke="white" onClick={() => setShowKswapBalanceModal(false)} />
          </RowBetween>
        </CardSection>
        <Break />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md" justify="center">
                <KswapTokenAnimated width="48px" src={tokenLogo} />{' '}
                <TYPE.white fontSize={48} fontWeight={600} color="white">
                  {total?.toFixed(2, { groupSeparator: ',' })}
                </TYPE.white>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white color="white">{t('header.balance')}</TYPE.white>
                  <TYPE.white color="white">{kswapBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">{t('header.unclaimed')}</TYPE.white>
                  <TYPE.white color="white">
                    {kswapToClaim?.toFixed(4, { groupSeparator: ',' })}{' '}
                    {kswapToClaim && kswapToClaim.greaterThan('0') && (
                      <StyledInternalLink
                        onClick={() => setShowKswapBalanceModal(false)}
                        to={isBeta ? BETA_MENU_LINK.pool : `/kswap/${DOUBLE_SIDE_STAKING_REWARDS_CURRENT_VERSION}`}
                      >
                        ({t('earn.claim')})
                      </StyledInternalLink>
                    )}
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white color="white">{t('header.kswapPrice')}</TYPE.white>
              <TYPE.white color="white">${kswapPrice?.toFixed(2, { groupSeparator: ',' }) ?? '-'}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">{t('header.kswapCirculation')}</TYPE.white>
              <TYPE.white color="white">{circulation?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">{t('header.totalSupply')}</TYPE.white>
              <TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
          </AutoColumn>
        </CardSection>
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md">
                <AddKSWAP
                  onClick={() => {
                    injected.getProvider().then(provider => {
                      if (provider) {
                        provider
                          .request({
                            method: 'wallet_watchAsset',
                            params: {
                              type: 'ERC20',
                              options: {
                                address: kswap?.address,
                                symbol: kswap?.symbol,
                                decimals: kswap?.decimals,
                                image: getTokenLogoURL(KSWAP[ChainId.KALYCHAIN].address, 48)
                              }
                            }
                          })
                          .catch((error: any) => {
                            console.error(error)
                          })
                      }
                    })
                  }}
                >
                  <TYPE.white color="white">{t('header.addMetamask')}</TYPE.white>
                </AddKSWAP>
              </AutoColumn>
            </CardSection>
          </>
        )}
      </ModalUpper>
    </ContentWrapper>
  )
}
