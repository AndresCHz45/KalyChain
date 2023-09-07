import React, { useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'

import { RouteComponentProps } from 'react-router-dom'
import { useCurrency } from '../../hooks/Tokens'
import { ExternalLink, TYPE } from '../../theme'

import { RowBetween } from '../../components/Row'
import { CardSection, DataCard } from '../../components/earn/styled'
import { ButtonPrimary } from '../../components/Button'
import { useStakingInfo } from '../../state/stake/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'

import { PairState, usePair } from '../../data/Reserves'
import StakingModal from '../../components/earn/StakingModal'
import UnstakingModal from '../../components/earn/UnstakingModal'
import Confetti from '../../components/Confetti'
import BridgeMigratorModal from '../../components/earn/BridgeMigratorModal'
import Loader from '../../components/Loader'
import { Token, WKLC } from '@kalycoinproject/sdk'
import { getTokenLogoURL } from '../../constants'
import { KSWAP } from '../../constants/tokens'
import { ErrorText } from '../../components/swap/styleds'
import { injected } from '@kalycoinproject/components'
import { useChainId } from 'src/hooks'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const StepCard = styled(DataCard)`
  background: #22242a;
  overflow: hidden;
`

const SuccessCard = styled(DataCard)`
  background: green;
  overflow: hidden;
`

const ErrorCard = styled(DataCard)`
  background: darkred;
  overflow: hidden;
`

export default function Migrate({
  match: {
    params: { currencyIdFromA, currencyIdFromB, versionFrom, currencyIdToA, currencyIdToB, versionTo }
  }
}: RouteComponentProps<{
  currencyIdFromA: string
  currencyIdFromB: string
  versionFrom: string
  currencyIdToA: string
  currencyIdToB: string
  versionTo: string
}>) {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const currencyFromA = useCurrency(currencyIdFromA)
  const currencyFromB = useCurrency(currencyIdFromB)
  const currencyToA = useCurrency(currencyIdToA)
  const currencyToB = useCurrency(currencyIdToB)

  const [kslFromStatus, kslFrom] = usePair(currencyFromA ?? undefined, currencyFromB ?? undefined)
  const [kslToStatus, kslTo] = usePair(currencyToA ?? undefined, currencyToB ?? undefined)

  const canZap =
    (kslFrom?.involvesToken(KSWAP[chainId]) && kslTo?.involvesToken(KSWAP[chainId])) ||
    (kslFrom?.involvesToken(WKLC[chainId]) && kslTo?.involvesToken(WKLC[chainId]))

  const stakingInfoFrom = useStakingInfo(Number(versionFrom), kslFrom)?.[0]
  const stakingInfoTo = useStakingInfo(Number(versionTo), kslTo)?.[0]

  const kslFromBalance = useTokenBalance(account ?? undefined, kslFrom?.liquidityToken)
  const kslToBalance = useTokenBalance(account ?? undefined, kslTo?.liquidityToken)

  const arePairsDifferent = kslFrom?.liquidityToken?.address !== kslTo?.liquidityToken?.address

  // Step 1: Detect if old LP tokens are staked
  const requiresUnstake = stakingInfoFrom?.stakedAmount?.greaterThan('0')

  // Step 2: Detect if old LP is currently held and cannot be migrated directly to the new staking contract
  const requiresConvert = !requiresUnstake && arePairsDifferent && kslFromBalance?.greaterThan('0')

  // Step 3: Detect if new LP has been minted and not staked
  const requiresStake = !requiresUnstake && !requiresConvert && !!stakingInfoTo && kslToBalance?.greaterThan('0')

  // Detect if all steps have been completed
  const requiresNothing = !!kslFromBalance && !!kslToBalance && !requiresUnstake && !requiresConvert && !requiresStake

  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showMigrateModal, setShowMigrateModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)

  const addTokenButton = (token: Token | undefined) => {
    if (!token) return
    if (token.equals(KSWAP[chainId])) return
    if (token.equals(WKLC[chainId])) return
    return (
      <ButtonPrimary
        width={'250'}
        onClick={() => {
          injected.getProvider().then(provider => {
            provider
              .request({
                method: 'wallet_watchAsset',
                params: {
                  type: 'ERC20',
                  options: {
                    address: token.address,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    image: getTokenLogoURL(token.address, 48)
                  }
                }
              })
              .catch((error: any) => {
                console.error(error)
              })
          })
        }}
      >
        Add {token.symbol}
      </ButtonPrimary>
    )
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <RowBetween style={{ gap: '24px' }}>
        <TYPE.mediumHeader style={{ margin: 0 }}>Liquidity Migration</TYPE.mediumHeader>
      </RowBetween>

      {kslFromStatus === PairState.LOADING || kslToStatus === PairState.LOADING ? (
        <Loader />
      ) : kslFromStatus === PairState.EXISTS && kslToStatus === PairState.EXISTS ? (
        <>
          <StepCard>
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>Step 1. Unstake Kalyswap liquidity (KSL)</TYPE.white>
                </RowBetween>
                {requiresUnstake && (
                  <>
                    <RowBetween style={{ marginBottom: '1rem' }}>
                      <TYPE.white fontSize={14}>
                        {`You are currently staking deprecated KSL tokens. Unstake to continue the migration process`}
                      </TYPE.white>
                    </RowBetween>
                    <ButtonPrimary
                      padding="8px"
                      borderRadius="8px"
                      width={'fit-content'}
                      onClick={() => setShowUnstakingModal(true)}
                    >
                      {`Unstake ${stakingInfoFrom?.stakedAmount?.toSignificant(4) ?? ''} ${kslFrom?.token0?.symbol}-${
                        kslFrom?.token1?.symbol
                      } liquidity`}
                    </ButtonPrimary>
                  </>
                )}
              </AutoColumn>
            </CardSection>
          </StepCard>

          <StepCard>
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>Step 2. Convert Kalyswap liquidity tokens (KSL)</TYPE.white>
                </RowBetween>
                {requiresConvert && (
                  <>
                    <RowBetween style={{ marginBottom: '1rem' }}>
                      <TYPE.white fontSize={14}>
                        {`You are currently holding deprecated KSL tokens. Migrate them including the underlying assets they represent to continue the migration process`}
                      </TYPE.white>
                    </RowBetween>
                    {canZap ? (
                      <ButtonPrimary
                        padding="8px"
                        borderRadius="8px"
                        width={'fit-content'}
                        onClick={() => setShowMigrateModal(true)}
                      >
                        {`Migrate ${kslFromBalance?.toSignificant(4) ?? ''} ${kslFrom?.token0?.symbol}-${
                          kslFrom?.token1?.symbol
                        } to ${kslTo?.token0?.symbol}-${kslTo?.token1?.symbol}`}
                      </ButtonPrimary>
                    ) : (
                      <ErrorText severity={2}>
                        {`Kalyswap does not support auto migration of this pair. Please withdraw the KSL and upgrade the tokens at `}
                        <ExternalLink href={'https://bridge.klc.network/convert'}>
                          https://bridge.klc.network/convert
                        </ExternalLink>
                      </ErrorText>
                    )}
                  </>
                )}
              </AutoColumn>
            </CardSection>
          </StepCard>

          <StepCard>
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>Step 3. Stake Kalyswap liquidity (KSL)</TYPE.white>
                </RowBetween>
                {requiresStake && (
                  <>
                    <ButtonPrimary
                      padding="8px"
                      borderRadius="8px"
                      width={'fit-content'}
                      onClick={() => setShowStakingModal(true)}
                    >
                      {`Stake ${kslToBalance?.toSignificant(4) ?? ''} ${kslTo?.token0?.symbol}-${
                        kslTo?.token1?.symbol
                      } liquidity to earn KSWAP`}
                    </ButtonPrimary>
                  </>
                )}
              </AutoColumn>
            </CardSection>
          </StepCard>

          {requiresNothing && (
            <>
              <SuccessCard>
                <CardSection>
                  <AutoColumn gap="md">
                    <RowBetween>
                      <TYPE.white fontWeight={600} textAlign={'center'}>
                        {'Congratulations you have successfully migrated!'}
                      </TYPE.white>
                    </RowBetween>
                  </AutoColumn>
                </CardSection>
              </SuccessCard>
              {addTokenButton(kslTo?.token0)}
              {addTokenButton(kslTo?.token1)}
            </>
          )}
        </>
      ) : (
        <ErrorCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600} textAlign={'center'}>
                  {`Error finding pairs ${currencyFromA?.symbol ?? '?'}/${currencyFromB?.symbol ??
                    '?'} and ${currencyToA?.symbol ?? '?'}/${currencyToB?.symbol ?? '?'}`}
                </TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
        </ErrorCard>
      )}

      <Confetti start={requiresNothing && !showMigrateModal && !showStakingModal} />

      {stakingInfoFrom && (
        <UnstakingModal
          isOpen={showUnstakingModal}
          onDismiss={() => setShowUnstakingModal(false)}
          stakingInfo={stakingInfoFrom}
          version={Number(versionFrom)}
        />
      )}

      {kslFrom && kslTo && (
        <BridgeMigratorModal
          isOpen={showMigrateModal}
          onDismiss={() => setShowMigrateModal(false)}
          pairFrom={kslFrom}
          pairTo={kslTo}
          userLiquidityUnstaked={kslFromBalance}
        />
      )}

      {stakingInfoTo && (
        <StakingModal
          isOpen={showStakingModal}
          onDismiss={() => setShowStakingModal(false)}
          stakingInfo={stakingInfoTo}
          userLiquidityUnstaked={kslToBalance}
          version={Number(versionTo)}
        />
      )}
    </PageWrapper>
  )
}
