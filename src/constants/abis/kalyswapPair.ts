import { Interface } from '@ethersproject/abi'
import { abi as IKalyswapPairABI } from '../../artifacts/kalyswap-core/IKalyswapPair.json'

const KALYSWAP_PAIR_INTERFACE = new Interface(IKalyswapPairABI)

export { KALYSWAP_PAIR_INTERFACE }
