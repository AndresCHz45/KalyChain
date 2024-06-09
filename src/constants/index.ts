import { ChainId, JSBI, Percent, Token, WKLC, CHAINS } from '@kalycoinproject/sdk'
import { BNB, BTCB, ETH, KSWAP, MATIC, USDT } from './tokens'

export const GAS_PRICE = 225

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.TESTNET]: CHAINS[ChainId.TESTNET].contracts!.router,
  [ChainId.KALYCHAIN]: CHAINS[ChainId.KALYCHAIN].contracts!.router
}

export const LANDING_PAGE = 'https://kalyswap.io'
export const BRIDGE_PAGE = 'https://bridge.kalychain.io'
export const IDO_PAGE = 'https://kalypad.kalyswap.io'

export const KALYSWAP_API_BASE_URL = `https://api.kalyswap.io`

export const KALYSWAP_TOKENS_REPO_RAW_BASE_URL = `https://raw.githubusercontent.com/kalycoinproject/tokens`

export const DIRECTUS_GRAPHQL_URL = ``

export type LogoSize = 24 | 48
export const getTokenLogoURL = (address: string, size: LogoSize = 24) =>
  `${KALYSWAP_TOKENS_REPO_RAW_BASE_URL}/main/assets/3888/${address}/logo_${size}.png`

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const GOVERNANCE_ADDRESS = '0x567371A8D2B4456061abBaf4aE4d5756e74e9458'

export const BRIDGE_MIGRATOR_ADDRESS = ''

export const MINICHEF_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.TESTNET]: ZERO_ADDRESS,
  [ChainId.KALYCHAIN]: CHAINS[ChainId.KALYCHAIN].contracts!.mini_chef!
}

export const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.TESTNET]: CHAINS[ChainId.TESTNET].contracts!.airdrop!,
  [ChainId.KALYCHAIN]: CHAINS[ChainId.KALYCHAIN].contracts!.airdrop!
}

const WKLC_AND_KSWAP_ONLY: ChainTokenList = {
  [ChainId.TESTNET]: [WKLC[ChainId.TESTNET], KSWAP[ChainId.TESTNET]],
  [ChainId.KALYCHAIN]: [WKLC[ChainId.KALYCHAIN], KSWAP[ChainId.KALYCHAIN]]
}

export const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.TESTNET]: CHAINS[ChainId.TESTNET].name,
  [ChainId.KALYCHAIN]: CHAINS[ChainId.KALYCHAIN].name
}

export const NETWORK_CURRENCY: { [chainId in ChainId]?: string } = {
  [ChainId.TESTNET]: CHAINS[ChainId.TESTNET].symbol,
  [ChainId.KALYCHAIN]: CHAINS[ChainId.KALYCHAIN].symbol
}

export const NETWORK_WRAPPED_CURRENCY: { [chainId in ChainId]?: string } = {
  [ChainId.TESTNET]: 'WKLC',
  [ChainId.KALYCHAIN]: 'WKLC'
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.TESTNET]: [WKLC[ChainId.TESTNET], KSWAP[ChainId.TESTNET]],
  [ChainId.KALYCHAIN]: [
    WKLC[ChainId.KALYCHAIN],
    KSWAP[ChainId.KALYCHAIN],
    USDT[ChainId.KALYCHAIN],
    ETH[ChainId.KALYCHAIN],
    BNB[ChainId.KALYCHAIN],
    MATIC[ChainId.KALYCHAIN],
    BTCB[ChainId.KALYCHAIN]
  ],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.KALYCHAIN]: {}
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WKLC_AND_KSWAP_ONLY
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WKLC_AND_KSWAP_ONLY
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.KALYCHAIN]: []
}

// these tokens can be directly linked to (via url params) in the swap page without prompting a warning
export const TRUSTED_TOKEN_ADDRESSES: { readonly [chainId in ChainId]: string[] } = {
  [ChainId.TESTNET]: [WKLC[ChainId.TESTNET].address, KSWAP[ChainId.TESTNET].address],
  [ChainId.KALYCHAIN]: [WKLC[ChainId.KALYCHAIN].address, KSWAP[ChainId.KALYCHAIN].address]
}

export const SWAP_DEFAULT_CURRENCY = {
  [ChainId.KALYCHAIN]: {
    inputCurrency: 'KLC',
    outputCurrency: ''
  },
  [ChainId.TESTNET]: {
    inputCurrency: 'KLC',
    outputCurrency: ''
  }
}

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 10 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 10 * 60

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_ONE = JSBI.BigInt(1)
export const BIG_INT_TWO = JSBI.BigInt(2)
export const BIG_INT_TEN = JSBI.BigInt(10)
export const BIG_INT_EIGHTEEN = JSBI.BigInt(18)
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)
export const ONE_TOKEN = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))

export const MOONPAY_PK = process.env.REACT_APP_MOONPAY_PK || ''
export const WYRE_API_KEY = process.env.REACT_APP_WYRE_API_KEY ? process.env.REACT_APP_WYRE_API_KEY : ''
export const WYRE_SECRET_KEY = process.env.REACT_APP_WYRE_SECRET_KEY ? process.env.REACT_APP_WYRE_SECRET_KEY : ''
export const WYRE_ID = process.env.REACT_APP_WYRE_ID ? process.env.REACT_APP_WYRE_ID : ''
export const WYRE_API_URL = 'https://api.sendwyre.com'
export const WYRE_QUOTE_API_ENDPOINT = '/v3/orders/quote/partner'
export const WYRE_RESERVE_API_ENDPOINT = '/v3/orders/reserve'
export const WYRE_CALLBACK_URL = 'https://app.kalyswap.io/'
export const SUBGRAPH_BASE_URL = process.env.REACT_APP_SUBGRAPH_BASE_URL

export const IS_IN_IFRAME = window.parent !== window
export const TIMEFRAME = [
  {
    description: 'HOUR',
    label: '1H',
    interval: 60,
    momentIdentifier: 'hour'
  },
  {
    description: 'DAY',
    label: '1D',
    interval: 3600,
    momentIdentifier: 'day'
  },
  {
    description: 'WEEK',
    label: '1W',
    interval: 86400,
    momentIdentifier: 'week'
  },
  {
    description: 'MONTH',
    label: '1M',
    interval: 604800,
    momentIdentifier: 'month'
  },
  {
    description: 'YEAR',
    label: '1Y',
    interval: 2629746,
    momentIdentifier: 'year'
  },
  {
    description: 'ALL',
    label: 'ALL',
    interval: 2629746,
    momentIdentifier: ''
  }
]

export enum BETA_MENU_LINK {
  dashboard = '/beta/dashboard',
  swap = '/beta/swap',
  buy = '/beta/buy',
  pool = '/beta/pool',
  stake = '/beta/stake',
  vote = '/beta/vote',
  migrate = '/beta/migrate',
  bridge = '/beta/bridge',
  airdrop = '/beta/airdrop'
}
