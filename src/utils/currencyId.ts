import { Currency, KLC, Token, ChainId } from '@kalycoinproject/sdk'

export function currencyId(currency: Currency, chainId: ChainId): string {
  if (chainId && currency === KLC[chainId]) return 'KLC'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
