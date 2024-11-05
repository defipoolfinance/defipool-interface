# DeFi Pool Labs Web Interface

## Accessing the DeFi Pool

To access the DeFi Pool, use an IPFS gateway

## Running the interface locally

```bash
yarn
yarn web start
```

## Unsupported tokens

Check out `useUnsupportedTokenList()` in [src/state/lists/hooks.ts](./src/state/lists/hooks.ts) for blocking tokens in your instance of the interface.

You can block an entire list of tokens by passing in a tokenlist like [here](./src/constants/lists.ts)

## Accessing DeFi Pool V2

The DeFi Pool supports swapping, adding liquidity, removing liquidity and migrating liquidity for DeFi Pool.

## Accessing DeFi Pool V1

The DeFi Pool V1 interface for mainnet and testnets is accessible via IPFS gateways
