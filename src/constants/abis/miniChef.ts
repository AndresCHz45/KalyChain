import { Interface } from '@ethersproject/abi'
import { abi as MINICHEF_ABI } from './MiniChefV2.json'

const MINICHEF_INTERFACE = new Interface(MINICHEF_ABI)

export { MINICHEF_INTERFACE }
