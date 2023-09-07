import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import { EarnV1, EarnV2, ManageV1, ManageV2 } from './Earn'
import Stake from './Stake'
import ManageStake from './Stake/Manage'
import Pool from './Pool'
import Buy from './Buy'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import Airdrop from './Airdrop'

import Vote from './Vote'
import VotePage from './Vote/VotePage'

import IDO from './IDO'
import Migrate from './Earn/Migrate'

import { useIsBetaUI } from '../hooks/useLocation'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div<{ isBeta: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top:  ${({ isBeta }) => (isBeta ? '0px' : '100px')}; 
  align-items: ${({ isBeta }) => (isBeta ? 'unset' : 'center')};
  // padding: ${({ isBeta }) => (isBeta ? '50px' : undefined)};
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  min-height: 100vh;

  ${({ theme, isBeta }) => theme.mediaWidth.upToSmall`
    padding: ${isBeta ? '0px' : '16px'};
    padding-top: ${isBeta ? '0px' : '2rem'}; 
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  const isBeta = useIsBetaUI()

  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        {!isBeta && (
          <>
            <URLWarning />
            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
          </>
        )}

        <BodyWrapper isBeta={isBeta}>
          <Popups />
          <Polling />
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/buy" component={Buy} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/kswap/2" component={EarnV2} />
              <Route exact strict path="/kswap/:version" component={EarnV1} />
              <Route exact strict path="/stake/:version" component={Stake} />
              <Route exact strict path="/vote" component={Vote} />
              <Route exact strict path="/ido" component={IDO} />
              <Route exact strict path="/airdrop" component={Airdrop} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

              <Route exact strict path="/kswap/:currencyIdA/:currencyIdB/2" component={ManageV2} />
              <Route exact strict path="/kswap/:currencyIdA/:currencyIdB/:version" component={ManageV1} />

              <Route exact strict path="/stake/:version/:rewardCurrencyId" component={ManageStake} />
              <Route exact strict path="/vote/:id" component={VotePage} />
              <Route
                exact
                path="/migrate/:currencyIdFromA/:currencyIdFromB/:versionFrom/:currencyIdToA/:currencyIdToB/:versionTo/"
                component={Migrate}
              />

              <Route component={RedirectPathToSwapOnly} />
            </Switch>
          </Web3ReactManager>
          {!isBeta && <Marginer />}
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
