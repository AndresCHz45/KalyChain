import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { JSBI } from '@kalycoinproject/sdk'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useCurrency } from 'src/hooks/Tokens'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { TYPE } from 'src/theme'

import { RowBetween } from 'src/components/Row'
import { AutoColumn } from 'src/components/Column'
import { CardSection, DataCard } from 'src/components/earn/styled'
import { ButtonPrimary, ButtonEmpty, ButtonSecondary } from 'src/components/Button'
import { useSingleSideStakingInfo } from 'src/state/stake/hooks'
import { useActiveWeb3React, useChainId } from 'src/hooks'
import { useColor } from 'src/hooks/useColor'
import { CountUp } from 'use-count-up'

import { wrappedCurrency } from 'src/utils/wrappedCurrency'
import usePrevious from 'src/hooks/usePrevious'
import { BIG_INT_ZERO, ZERO_ADDRESS } from 'src/constants'
import { KSWAP } from 'src/constants/tokens'
import CurrencyLogo from 'src/components/CurrencyLogo'
import StakingModalSingleSide from 'src/components/earn/StakingModalSingleSide'
import UnstakingModalSingleSide from 'src/components/earn/UnstakingModalSingleSide'
import ClaimRewardModalSingleSide from 'src/components/earn/ClaimRewardModalSingleSide'
import { useTokenBalance } from 'src/state/wallet/hooks'
import { useTranslation } from 'react-i18next'
import Loader from 'src/components/Loader'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const PositionInfo = styled(AutoColumn)<{ dim: any }>`
  position: relative;
  max-width: 640px;
  width: 100%;
  opacity: ${({ dim }) => (dim ? 0.6 : 1)};
`

const BottomSection = styled(AutoColumn)`
  border-radius: 12px;
  width: 100%;
  position: relative;
`

const StyledDataCard = styled(DataCard)<{ bgColor?: any; showBackground?: any }>`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #1e1a31 0%, #3d51a5 100%);
  z-index: 2;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: ${({ theme, bgColor, showBackground }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%,  ${showBackground ? theme.black : theme.bg5} 100%) `};
`

const StyledBottomCard = styled(DataCard)<{ dim: any }>`
  background: ${({ theme }) => theme.bg3};
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  margin-top: -40px;
  padding: 0 1.25rem 1rem 1.25rem;
  padding-top: 32px;
  z-index: 1;
`

const PoolData = styled(DataCard)`
  background: none;
  border: 1px solid ${({ theme }) => theme.bg4};
  padding: 1rem;
  z-index: 1;
`

const DataRow = styled(RowBetween)`
  justify-content: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
     flex-direction: column;
     gap: 12px;
   `};
`

export default function Manage({
  match: {
    params: { rewardCurrencyId, version }
  }
}: RouteComponentProps<{ rewardCurrencyId: string; version: string }>) {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const { t } = useTranslation()

  const rewardCurrency = useCurrency(rewardCurrencyId)
  const rewardToken = wrappedCurrency(rewardCurrency ?? undefined, chainId)

  const stakingInfo = useSingleSideStakingInfo(Number(version), rewardToken)?.[0]
  const kswap = KSWAP[chainId]

  const backgroundColorStakingToken = useColor(kswap)

  // detect existing unstaked position to show purchase button if none found
  const userKswapUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  const showGetKswapButton = useMemo(() => {
    if (!userKswapUnstaked || !stakingInfo) return true
    return Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userKswapUnstaked?.equalTo('0'))
  }, [stakingInfo, userKswapUnstaked])

  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const countUpAmount = stakingInfo?.earnedAmount?.toFixed(6) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  const toggleWalletModal = useWalletModalToggle()

  const handleStakeClick = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

  return (
    <PageWrapper gap="lg" justify="center">
      <RowBetween style={{ gap: '24px' }}>
        {chainId && <CurrencyLogo currency={kswap} chainId={chainId} />}
        <TYPE.mediumHeader style={{ margin: 0 }}>{t('earnPage.kswapStaking')}</TYPE.mediumHeader>
        {chainId && <CurrencyLogo currency={rewardCurrency ?? undefined} chainId={chainId} />}
      </RowBetween>

      <DataRow style={{ gap: '24px' }}>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>{t('earnPage.totalStaked')}</TYPE.body>
            <TYPE.body fontSize={24} fontWeight={500}>
              {stakingInfo ? (
                `${stakingInfo.totalStakedInKswap?.toSignificant(4, { groupSeparator: ',' })} KSWAP`
              ) : (
                <Loader />
              )}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>APR</TYPE.body>
            <TYPE.body fontSize={24} fontWeight={500}>
              {stakingInfo ? (
                JSBI.greaterThan(stakingInfo.apr, JSBI.BigInt(0)) ? (
                  `${stakingInfo.apr?.toLocaleString()}%`
                ) : (
                  ' - '
                )
              ) : (
                <Loader />
              )}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
      </DataRow>

      {stakingInfo && (
        <>
          <StakingModalSingleSide
            isOpen={showStakingModal}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo}
            userLiquidityUnstaked={userKswapUnstaked}
          />
          <UnstakingModalSingleSide
            isOpen={showUnstakingModal}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo}
          />
          <ClaimRewardModalSingleSide
            isOpen={showClaimRewardModal}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo}
          />
        </>
      )}

      <PositionInfo gap="lg" justify="center" dim={showGetKswapButton}>
        <BottomSection gap="lg" justify="center">
          <StyledDataCard bgColor={backgroundColorStakingToken} showBackground={!showGetKswapButton}>
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>{t('earnPage.yourStakedToken', { symbol: 'KSWAP' })}</TYPE.white>
                </RowBetween>
                <RowBetween style={{ alignItems: 'baseline' }}>
                  <TYPE.white fontSize={36} fontWeight={600}>
                    {stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'}
                  </TYPE.white>
                  <TYPE.white>KSWAP</TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
          </StyledDataCard>
          <StyledBottomCard dim={stakingInfo?.stakedAmount?.equalTo(JSBI.BigInt(0))}>
            <AutoColumn gap="sm">
              <RowBetween>
                <div>
                  <TYPE.black>{t('earnPage.unclaimedReward', { symbol: stakingInfo?.rewardToken?.symbol })}</TYPE.black>
                </div>
                {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) && (
                  <ButtonEmpty
                    padding="8px"
                    borderRadius="8px"
                    width="fit-content"
                    onClick={() => setShowClaimRewardModal(true)}
                  >
                    {t('earnPage.claim')}
                  </ButtonEmpty>
                )}
              </RowBetween>
              <RowBetween style={{ alignItems: 'baseline' }}>
                <TYPE.largeHeader fontSize={36} fontWeight={600}>
                  <CountUp
                    key={countUpAmount}
                    isCounting
                    decimalPlaces={4}
                    start={parseFloat(countUpAmountPrevious)}
                    end={parseFloat(countUpAmount)}
                    thousandsSeparator={','}
                    duration={1}
                  />
                </TYPE.largeHeader>
                <TYPE.black fontSize={16} fontWeight={500}>
                  <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
                    ⚡
                  </span>
                  {stakingInfo?.rewardRatePerWeek?.toSignificant(4, { groupSeparator: ',' }) ?? '-'}
                  {t('earnPage.rewardPerWeek', { symbol: rewardCurrency?.symbol })}
                </TYPE.black>
              </RowBetween>
            </AutoColumn>
          </StyledBottomCard>
        </BottomSection>
      </PositionInfo>

      <DataRow style={{ marginBottom: '1rem' }}>
        {userKswapUnstaked?.greaterThan('0') ? (
          <ButtonPrimary padding="10px" borderRadius="8px" width="auto" onClick={handleStakeClick}>
            {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0))
              ? t('earnPage.stake')
              : t('earnPage.stakeStakingTokens', { symbol: 'KSWAP' })}
          </ButtonPrimary>
        ) : (
          <ButtonPrimary
            padding="10px"
            width="auto"
            as={Link}
            to={`/swap?inputCurrency=${ZERO_ADDRESS}&outputCurrency=${kswap.address}`}
          >
            {t('earnPage.getToken', { symbol: 'KSWAP' })}
          </ButtonPrimary>
        )}

        {stakingInfo?.stakedAmount?.greaterThan('0') && (
          <ButtonSecondary padding="10px" borderRadius="8px" width="auto" onClick={() => setShowUnstakingModal(true)}>
            {t('earnPage.unstake')}
          </ButtonSecondary>
        )}
      </DataRow>

      {userKswapUnstaked?.greaterThan('0') && (
        <TYPE.main>
          {userKswapUnstaked.toSignificant(6)} {t('earnPage.stakingTokensAvailable', { symbol: 'KSWAP' })}
        </TYPE.main>
      )}
    </PageWrapper>
  )
}
