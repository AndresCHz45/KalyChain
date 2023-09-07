import React, { useContext, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import Card from '../../components/Card'
import { ButtonError } from '../../components/Button'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import {
  useAirdropIsClaimingAllowed,
  useClaimCallback,
  useUserHasAvailableClaim,
  useUserUnclaimedAmount
} from '../../state/airdrop/hooks'
import { useActiveWeb3React } from '../../hooks'
import Confetti from '../../components/Confetti'
import { useTokenBalance } from '../../state/wallet/hooks'
import { ETH, BNB } from '../../constants/tokens'
import { ChainId, JSBI } from '@kalycoinproject/sdk'
import { useTranslation } from 'react-i18next'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }

  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

export default function Vote() {
  const { account, chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

  // used for UI loading states
  const [attempting, setAttempting] = useState<boolean>(false)

  // monitor the status of the claim from contracts and txns
  const { claimCallback } = useClaimCallback(account)

  const claimingAllowed = useAirdropIsClaimingAllowed()
  const canClaim = useUserHasAvailableClaim(account)

  const claimAmount = useUserUnclaimedAmount(account)

  const ethAmount = useTokenBalance(account ? account : undefined, chainId ? ETH[chainId] : ETH[ChainId.KALYCHAIN])
  const bnbAmount = useTokenBalance(
    account ? account : undefined,
    chainId ? BNB[chainId] : BNB[ChainId.KALYCHAIN]
  )

  const hasETH = ethAmount?.greaterThan(JSBI.BigInt(1)) || ethAmount?.equalTo(JSBI.BigInt(1))
  const hasBNB = bnbAmount?.greaterThan(JSBI.BigInt(1)) || bnbAmount?.equalTo(JSBI.BigInt(1))

  const [hash, setHash] = useState<string | undefined>()

  // monitor the status of the claim from contracts and txns
  const claimPending = useIsTransactionPending(hash ?? '')
  const claimConfirmed = hash && !claimPending

  const [error, setError] = useState<any | undefined>()
  const { t } = useTranslation()

  // use the hash to monitor this txn

  function onClaim() {
    setAttempting(true)
    claimCallback()
      .then(_hash => {
        setAttempting(false)
        setHash(_hash)
      })
      // reset and log error
      .catch(err => {
        setAttempting(false)
        setError(err)
      })
  }

  const getCard = () => {
    if (!claimingAllowed) {
      return (
        <Card padding="40px">
          <TYPE.body color={theme.text3} textAlign="center">
            {t('airdrop.claimPeriodEnded')}
          </TYPE.body>
        </Card>
      )
    }
    if (!account) {
      return (
        <Card padding="40px">
          <TYPE.body color={theme.text3} textAlign="center">
            {t('airdrop.connectWalletViewLiquidity')}
          </TYPE.body>
        </Card>
      )
    }
    if (!canClaim) {
      return (
        <Card padding="40px">
          <TYPE.body color={theme.text3} textAlign="center">
            {t('airdrop.noAvailableClaim')}
          </TYPE.body>
        </Card>
      )
    }
    if (!hasETH && !hasBNB) {
      return (
        <Card padding="40px">
          <TYPE.body color={theme.text1} textAlign="center">
            {t('airdrop.noETHNoBNB')}
          </TYPE.body>
          <TYPE.body mt="1rem" color={theme.text1} textAlign="center">
            {t('airdrop.youHave') + claimAmount?.toFixed(0, { groupSeparator: ',' }) + t('airdrop.kswapAvailableClaim')}
          </TYPE.body>
        </Card>
      )
    }
    if (attempting) {
      return (
        <EmptyProposals>
          <TYPE.body color={theme.text3} textAlign="center">
            <Dots>{t('airdrop.Loading')}</Dots>
          </TYPE.body>
        </EmptyProposals>
      )
    }
    if (claimConfirmed) {
      return (
        <TYPE.subHeader mt="1rem" fontWeight={500} color={theme.text1}>
          <span role="img" aria-label="party-hat">
            🎉{' '}
          </span>
          {t('airdrop.welcomeToTeamKalyswap')}
          <span role="img" aria-label="party-hat">
            {' '}
            🎉
          </span>
        </TYPE.subHeader>
      )
    }

    return (
      <ButtonError error={!!error} padding="16px 16px" width="100%" mt="1rem" onClick={onClaim}>
        {error
          ? error['data']['message']
          : t('airdrop.claim') + claimAmount?.toFixed(0, { groupSeparator: ',' }) + ' KSWAP'}
      </ButtonError>
    )
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="2px">
        <Confetti start={Boolean(claimConfirmed)} />
        <TYPE.mediumHeader style={{ margin: '0.5rem 0' }} textAlign="center">
          {t('airdrop.claimKswapAirdrop')}
        </TYPE.mediumHeader>
        {getCard()}
      </TopSection>
    </PageWrapper>
  )
}
