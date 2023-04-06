import type { Ethereum } from '@wagmi/connectors'
import type {
  Address,
  ResolvedConfig,
  TypedData,
  TypedDataDomain,
  TypedDataToPrimitiveTypes,
} from 'abitype'
import type {
  Account,
  FallbackTransportConfig,
  HttpTransport,
  PublicClient,
  Transport,
  WalletClient,
  WebSocketTransport,
} from 'viem'

import type { Chain } from '../chains'

declare module 'abitype' {
  export interface Config {
    BigIntType: bigint
    IntType: number
  }
}

declare module 'ethers/lib/utils.js' {
  export function getAddress(address: string): Address
  export function isAddress(address: string): address is Address
  export function verifyTypedData<
    TTypedData extends TypedData,
    TSchema extends TypedDataToPrimitiveTypes<TTypedData>,
  >(
    domain: TypedDataDomain,
    types: TTypedData,
    value: TSchema[keyof TSchema] extends infer TValue
      ? { [x: string]: any } extends TValue
        ? Record<string, any>
        : TValue
      : never,
    signature:
      | {
          r: string
          s?: string
          _vs?: string
          recoveryParam?: number
          v?: number
        }
      | ResolvedConfig['BytesType']
      | string,
  ): string
}

export type Hash = `0x${string}`

export type ChainProviderFn<TChain extends Chain = Chain> = (chain: TChain) => {
  chain: TChain
  rpcUrls: RpcUrls
} | null

export type FallbackProviderConfig = Pick<
  FallbackTransportConfig,
  'rank' | 'retryCount' | 'retryDelay'
>
export type ProviderWithFallbackConfig<TProvider extends Provider = Provider> =
  TProvider & FallbackProviderConfig

export type Provider<TChain extends Chain = Chain> = PublicClient<
  HttpTransport,
  TChain
> & { chains?: Chain[] }
export type WebSocketProvider<TChain extends Chain = Chain> = PublicClient<
  WebSocketTransport,
  TChain
> & {
  chains?: Chain[]
}

export type RpcUrls = {
  http: readonly string[]
  webSocket?: readonly string[]
}

export type Signer<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends Account = Account,
> = WalletClient<TTransport, TChain, TAccount>

export type Unit = 'ether' | 'gwei' | 'wei' | number

declare global {
  interface Window {
    ethereum?: Ethereum
  }
}
