import { ChainId, WKLC } from '@kalycoinproject/sdk'
import { MINICHEF_ADDRESS } from '../../constants'
import * as TOKENS from '../../constants/tokens'
import { BridgeMigrator, DoubleSideStaking, Migration } from './hooks'

export const DOUBLE_SIDE_STAKING: { [key: string]: DoubleSideStaking } = {
  WKLC_KSWAP_V1: {
    tokens: [WKLC[ChainId.KALYCHAIN], TOKENS.KSWAP[ChainId.KALYCHAIN]],
    stakingRewardAddress: '0xaeE3B717Fb33D9fdDb4FBd0A6906Bc34Da5a67ab',
    version: 1,
    multiplier: 0
  },
  WKLC_KSWAP_V2: {
    tokens: [WKLC[ChainId.KALYCHAIN], TOKENS.KSWAP[ChainId.KALYCHAIN]],
    stakingRewardAddress: MINICHEF_ADDRESS[ChainId.KALYCHAIN],
    version: 2
  },
}
export const MIGRATIONS: Migration[] = []
export const BRIDGE_MIGRATORS: BridgeMigrator[] = []

export const DOUBLE_SIDE_STAKING_V0: DoubleSideStaking[] = Object.values(DOUBLE_SIDE_STAKING).filter(
  staking => staking.version === 0
)
export const DOUBLE_SIDE_STAKING_V1: DoubleSideStaking[] = Object.values(DOUBLE_SIDE_STAKING).filter(
  staking => staking.version === 1
)
export const DOUBLE_SIDE_STAKING_V2: DoubleSideStaking[] = Object.values(DOUBLE_SIDE_STAKING).filter(
  staking => staking.version === 2
)

export const DOUBLE_SIDE_STAKING_REWARDS_CURRENT_VERSION = Math.max(
  ...Object.values(DOUBLE_SIDE_STAKING).map(staking => staking.version)
)

export const DOUBLE_SIDE_STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: DoubleSideStaking[][]
} = {
  [ChainId.TESTNET]: [DOUBLE_SIDE_STAKING_V0, DOUBLE_SIDE_STAKING_V1, DOUBLE_SIDE_STAKING_V2],
  [ChainId.KALYCHAIN]: [DOUBLE_SIDE_STAKING_V0, DOUBLE_SIDE_STAKING_V1, DOUBLE_SIDE_STAKING_V2]
}
