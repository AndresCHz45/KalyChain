import { ChainId, WKLC, KALYCHAIN_TESTNET } from '@kalycoinproject/sdk'
import { KSWAP } from '../../constants/tokens'
import { SingleSideStaking } from './hooks'

export const SINGLE_SIDE_STAKING: { [key: string]: SingleSideStaking } = {
  KSWAP_V0: {
    rewardToken: KSWAP[ChainId.KALYCHAIN],
    conversionRouteHops: [WKLC[ChainId.KALYCHAIN]],
    stakingRewardAddress: '0xA42EbDA6371358643AD4973F1fb3DA75d32af98A',
    version: 0 
  }
}

export const SINGLE_SIDE_STAKING_V0: SingleSideStaking[] = Object.values(SINGLE_SIDE_STAKING).filter(
  staking => staking.version === 0
)
export const SINGLE_SIDE_STAKING_REWARDS_CURRENT_VERSION = Math.max(
  ...Object.values(SINGLE_SIDE_STAKING).map(staking => staking.version)
)

const TESTNET_SINGLE_SIDE_STAKING: SingleSideStaking[] =
  KALYCHAIN_TESTNET.contracts?.staking
    ?.filter(contract => contract.active)
    .map(contract => ({
      rewardToken: KSWAP[ChainId.TESTNET],
      conversionRouteHops: [WKLC[ChainId.TESTNET]],
      stakingRewardAddress: contract.address,
      version: 0
    })) ?? []

export const SINGLE_SIDE_STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: SingleSideStaking[][]
} = {
  [ChainId.KALYCHAIN]: [SINGLE_SIDE_STAKING_V0],
  [ChainId.TESTNET]: [TESTNET_SINGLE_SIDE_STAKING]
}
