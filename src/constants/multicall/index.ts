import { ChainId } from '@kalycoinproject/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.TESTNET]: '0x67e2f36C69EB85239631cD9149f0A67b2a5FfBC1',
  [ChainId.KALYCHAIN]: '0xD7a3C1253E8ddE3d61B0B6d469b241df307D399D'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
