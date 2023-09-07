import { ChainId, Token, CHAINS } from '@kalycoinproject/sdk'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const KSWAP: { [chainId in ChainId]: Token } = {
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    CHAINS[ChainId.TESTNET].contracts!.kswap,
    18,
    CHAINS[ChainId.TESTNET].kswap_symbol,
    'Kalyswap'
  ),
  [ChainId.KALYCHAIN]: new Token(
    ChainId.KALYCHAIN,
    CHAINS[ChainId.KALYCHAIN].contracts!.kswap,
    18,
    CHAINS[ChainId.KALYCHAIN].kswap_symbol,
    'Kalyswap'
  )
}


export const ETH: { [chainId in ChainId]: Token } = {
  [ChainId.TESTNET]: new Token(ChainId.TESTNET, ZERO_ADDRESS, 18, 'ETH', 'Ether'),
  [ChainId.KALYCHAIN]: new Token(ChainId.KALYCHAIN, '0xad89EA57DB2092b66641E732F51ADf483Ac18C21', 18, 'ETH', 'Ether')
}

export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.TESTNET]: new Token(ChainId.TESTNET, '0xF29AD0640731c50d0c7C999D1f8d5Ffb9E2A3da3', 18, 'USDT', 'Tether USD'),
  [ChainId.KALYCHAIN]: new Token(
    ChainId.KALYCHAIN,
    '0x37540F0cC489088c01631138Da2E32cF406B83B8',
    18,
    'USDT',
    'Tether USD'
  )
}

export const USDt: { [chainId in ChainId]: Token } = {
  [ChainId.TESTNET]: new Token(ChainId.TESTNET, '0xF29AD0640731c50d0c7C999D1f8d5Ffb9E2A3da3', 18, 'USDT', 'Tether USD'),
  [ChainId.KALYCHAIN]: new Token(
    ChainId.KALYCHAIN,
    '0x37540F0cC489088c01631138Da2E32cF406B83B8',
    18,
    'USDT',
    'Tether USD'
  )
}

export const BTCB: { [chainId in ChainId]: Token } = {
  [ChainId.TESTNET]: new Token(ChainId.TESTNET, ZERO_ADDRESS, 8, 'BTCB', 'Wrapped Bitcoin'),
  [ChainId.KALYCHAIN]: new Token(
    ChainId.KALYCHAIN,
    '0xD0731970CCFEc3EB25c16e956F0b6902Fba75B69',
    18,
    'BTCB',
    'Wrapped Bitcoin'
  )
}

export const BNB: { [chainId in ChainId]: Token } = {
  [ChainId.TESTNET]: new Token(ChainId.TESTNET, ZERO_ADDRESS, 18, 'BNB', 'Binance'),
  [ChainId.KALYCHAIN]: new Token(
    ChainId.KALYCHAIN,
    '0x2F4fB121ad39B71A4516aaa88a5C7ea926f5350f',
    18,
    'BNB',
    'Binance'
  )
}

export const MATIC: { [chainId in ChainId]: Token } = {
  [ChainId.TESTNET]: new Token(ChainId.TESTNET, ZERO_ADDRESS, 18, 'MATIC', 'Matic Token'),
  [ChainId.KALYCHAIN]: new Token(
    ChainId.KALYCHAIN,
    '0x343bE88Bb1Aa79Ba451760ffc2b1f3BB85da521A',
    18,
    'MATIC',
    'Matic Token'
  )
}