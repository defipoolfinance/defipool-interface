import { ChainId } from '@uniswap/sdk-core'
import type { TokenList } from '@uniswap/token-lists'
import { DE_FI_LIST } from 'constants/lists'
import { PATEX_BSC_TESTNET } from 'constants/tokens'
import contenthashToUri from 'lib/utils/contenthashToUri'
import parseENSAddress from 'lib/utils/parseENSAddress'
import uriToHttp from 'lib/utils/uriToHttp'
import { validateTokenList } from 'utils/validateTokenList'

const listCache = new Map<string, TokenList>()

/**
 * Fetches and validates a token list.
 * For a given token list URL, we try to fetch the list from all the possible HTTP URLs.
 * For example, IPFS URLs can be fetched through multiple gateways.
 */
export default async function fetchTokenList(
  listUrl: string,
  resolveENSContentHash: (ensName: string) => Promise<string>,
  skipValidation?: boolean
): Promise<TokenList> {
  const cached = listCache?.get(listUrl) // avoid spurious re-fetches
  if (cached) {
    return cached
  }

  // FIXME: remove hardcode
  // console.log('listUrl::', listUrl, DE_FI_LIST)
  // console.log('hardcodedDexList::', hardcodedDexList)
  if (listUrl === DE_FI_LIST) return hardcodedDexList
  // if (typeof listUrl === 'string' && !listUrl.includes()) return hardcodedDexList

  let urls: string[]
  const parsedENS = parseENSAddress(listUrl)
  if (parsedENS) {
    let contentHashUri
    try {
      contentHashUri = await resolveENSContentHash(parsedENS.ensName)
    } catch (error) {
      const message = `failed to resolve ENS name: ${parsedENS.ensName}`
      console.debug(message, error)
      throw new Error(message)
    }
    let translatedUri
    try {
      translatedUri = contenthashToUri(contentHashUri)
    } catch (error) {
      const message = `failed to translate contenthash to URI: ${contentHashUri}`
      console.debug(message, error)
      throw new Error(message)
    }
    urls = uriToHttp(`${translatedUri}${parsedENS.ensPath ?? ''}`)
  } else {
    urls = uriToHttp(listUrl)
  }

  if (urls.length === 0) {
    throw new Error('Unrecognized list URL protocol.')
  }

  // Try each of the derived URLs until one succeeds.
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    let response
    try {
      response = await fetch(url, { credentials: 'omit' })
    } catch (error) {
      console.debug(`failed to fetch list: ${listUrl} (${url})`, error)
      continue
    }

    if (!response.ok) {
      console.debug(`failed to fetch list ${listUrl} (${url})`, response.statusText)
      continue
    }

    try {
      // The content of the result is sometimes invalid even with a 200 status code.
      // A response can be invalid if it's not a valid JSON or if it doesn't match the TokenList schema.
      const json = await response.json()
      const list = skipValidation ? json : await validateTokenList(json)
      listCache?.set(listUrl, list)
      return list
    } catch (error) {
      console.debug(`failed to parse and validate list response: ${listUrl} (${url})`, error)
      continue
    }
  }

  throw new Error(`No valid token list found at any URLs derived from ${listUrl}.`)
}

// FIXME: replace hardcoded with some api
// eslint-disable-next-line
const hardcodedDexList: TokenList = {
  name: 'DeFi Pool tokens', // string;
  timestamp: 'Tue Apr 09 2024 15:04:59 GMT+0200 (Central European Summer Time)', // string;
  version: {
    major: 0, // number;
    minor: 0, // number;
    patch: 1, // number;
  },
  tokens: [
    {
      chainId: ChainId.BNB_TESTNET, // number;
      address: '0x7CE086A43a4e19edd5f3A2171a1fd510102BB0Fe', // string;
      name: 'USD Tether',
      decimals: 18,
      symbol: 'USDT',
      logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=032', // 'https://dummyimage.com/240x240/000/fff.jpg&text=USDT', // string;
    },
    {
      chainId: ChainId.BNB_TESTNET,
      address: '0x0e1b74b76704330d040f483852595DCCE40E7089',
      name: 'Wrapped BNB',
      decimals: 18,
      symbol: 'WBNB',
      logoURI: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=032', // 'https://dummyimage.com/240x240/000/fff.jpg&text=WBNB',
    },
    {
      chainId: ChainId.BNB_TESTNET,
      address: '0xBd6c91cAb96350AC9eb6638a9171093343B582A1',
      name: 'Binance USD',
      decimals: 6,
      symbol: 'BUSD',
      logoURI: 'https://cryptologos.cc/logos/binance-usd-busd-logo.svg?v=032',
    },
    {
      chainId: ChainId.BNB_TESTNET,
      address: '0xec15ef13257a5770BF19cb4E64B15b5AAE0E7a5b',
      name: 'DAI Stable',
      decimals: 18,
      symbol: 'DAI',
      logoURI: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=032',
    },
    {
      chainId: ChainId.BNB_TESTNET,
      address: '0xa47ef2636163Fc4b19241D1796165F066c630611',
      name: 'Local Coins',
      decimals: 18,
      symbol: 'LCC',
      logoURI: undefined,
    },
    {
      chainId: ChainId.BNB_TESTNET,
      address: '0x6d630CAA9bed9bB32F04e97e393E2C254ea95E17',
      name: 'Ikalas.com Faucet Token',
      decimals: 18,
      symbol: 'KIKF',
      logoURI: undefined,
    },
    {
      chainId: PATEX_BSC_TESTNET.chainId,
      address: PATEX_BSC_TESTNET.address,
      name: PATEX_BSC_TESTNET.name || 'Patex',
      decimals: PATEX_BSC_TESTNET.decimals,
      symbol: PATEX_BSC_TESTNET.symbol || 'PATEX',
      logoURI: 'https://img.cryptorank.io/coins/patex1688117734732.png', // 'https://dummyimage.com/240x240/000/fff.jpg&text=PTX',
    },
  ],
}

// export const PATEX_BSC_TESTNET = new Token(
//   ChainId.BNB_TESTNET,
//   '0x8eB171BAc8b42D85d2fE9AAA18B2dD62ef186126',
//   18,
//   'PATEX',
//   'Patex Token'
// )
