import { ChainId, WKLC, KALYCHAIN_TESTNET } from '@kalycoinproject/sdk'
import { KSWAP } from '../../constants/tokens'
import { SingleSideStaking } from './hooks'

export const SINGLE_SIDE_STAKING: { [key: string]: SingleSideStaking } = {
  KSWAP_V0: {
    rewardToken: KSWAP[ChainId.KALYCHAIN],
    conversionRouteHops: [WKLC[ChainId.KALYCHAIN]],
    stakingRewardAddress: '0xA9f1eB89452f825Bbc59007FAe13233953910582',
    version: 0 
  },
  KSWAP_V1: {
    rewardToken: KSWAP[ChainId.TESTNET],
    conversionRouteHops: [WKLC[ChainId.TESTNET]],
    stakingRewardAddress: '0x9bF0dBF13fB722F33751BeCD5D7877cCE447fa60',
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
