import axios from 'axios';
import { request, gql } from 'graphql-request';

const requestURL = 'https://api.tracer.finance/poolsv2/';
const networkId = '42161';

export type Series = 'tvl' | 'mint' | 'burn' | 'secondary-liquidity';

export interface TradeHistoryEntryRaw {
    date: number;
    pool: string;
    userAddress: string;
    type: string;
    updateIntervalId: string;
    payForClaim: boolean;
    fromAggregateBalance: boolean;
    transactionHashIn: string;
    transactionHashOut: string;
    tokenDecimals: number;
    tokenInAddress: string;
    tokenInSymbol: string;
    tokenInName: string;
    tokenInAmount: string;
    priceIn: string;
    priceOut: string;
    priceTokenAddress: string;
    priceTokenName: string;
    priceTokenSymbol: string;
    fee: string;
    tokenOutAddress: string;
    tokenOutSymbol: string;
    tokenOutName: string;
    tokenOutAmount: string;
}

export interface TradeHistoryEntry extends TvlEntry {
    pool: string;
    type: Series;
}

export type TradeHistorySeriesMap = {
    [type in Series]: TradeHistoryEntry[];
} & {
    address: string;
};

export type TradeHistoryMap = {
    [x: string]: TradeHistorySeriesMap;
};

export interface TvlEntry {
    address: string;
    timestamp: number;
    volume: number;
}

export async function fetchTradeHistory({
    poolAddress = '',
    page = '1',
    pageSize = '1000',
    sort = 'date',
    sortDirection = 'ASC',
    types = '',
} = {}): Promise<TradeHistoryMap> {
    const resp = await axios.get(
        requestURL +
            `tradeHistory?network=${networkId}&poolAddress=${poolAddress}&page=${page}&pageSize=${pageSize}&sort=${sort}&sortDirection=${sortDirection}&types=${types}`,
    );
    const tradeHistory = formatTrades(resp.data.rows);

    return tradeHistory;
}

function parseMint(trade: TradeHistoryEntryRaw): TradeHistoryEntry {
    return {
        address: trade.tokenOutAddress,
        timestamp: trade.date,
        pool: trade.tokenOutSymbol,
        type: 'mint',
        volume: (Number(trade.tokenOutAmount) / 1e6) * (Number(trade.priceOut) / 1e6),
    };
}

function parseBurn(trade: TradeHistoryEntryRaw): TradeHistoryEntry {
    return {
        address: trade.tokenInAddress,
        timestamp: trade.date,
        pool: trade.tokenInSymbol,
        type: 'burn',
        volume: (Number(trade.tokenInAmount) / 1e6) * (Number(trade.priceIn) / 1e6),
    };
}

function formatTrades(trades: TradeHistoryEntryRaw[]): TradeHistoryMap {
    const tradeHistoryMap: TradeHistoryMap = {};

    for (const trade of trades) {
        const type = trade.type;
        if (type.includes('Burn')) {
            if (!tradeHistoryMap[trade.tokenInSymbol]) {
                tradeHistoryMap[trade.tokenInSymbol] = {
                    mint: [],
                    burn: [],
                    'secondary-liquidity': [],
                    tvl: [],
                    address: '',
                };
            }
            tradeHistoryMap[trade.tokenInSymbol].address = trade.tokenInAddress;
            tradeHistoryMap[trade.tokenInSymbol].burn.push(parseBurn(trade));
        }
        if (type.includes('Mint')) {
            if (!tradeHistoryMap[trade.tokenOutSymbol]) {
                tradeHistoryMap[trade.tokenOutSymbol] = {
                    mint: [],
                    burn: [],
                    'secondary-liquidity': [],
                    tvl: [],
                    address: '',
                };
            }
            tradeHistoryMap[trade.tokenOutSymbol].address = trade.tokenOutAddress;
            tradeHistoryMap[trade.tokenOutSymbol].mint.push(parseMint(trade));
        }
    }

    return tradeHistoryMap;
}

async function getUpKeeps(skip: number) {
    const query = gql`
      query {
        upkeeps(
            first: 1000
            skip: ${skip}
        ) {
            pool {
                longToken
                shortToken
            }
            timestamp
            longBalance
            shortBalance
            }
      }`;
    const response = await request(
        'https://api.thegraph.com/subgraphs/name/tracer-protocol/perpetual-pools-v2-arbitrum-one',
        query,
    );
    return response.upkeeps;
}

function formatUpKeeps(tvl: any) {
    const l = tvl.map((t: any) => {
        return {
            address: t.pool.longToken,
            volume: Number(t.longBalance) / 1e6,
            timestamp: Number(t.timestamp),
        };
    });
    const s = tvl.map((t: any) => {
        return {
            address: t.pool.shortToken,
            volume: Number(t.shortBalance) / 1e6,
            timestamp: Number(t.timestamp),
        };
    });
    return l.concat(s);
}

async function getAllUpKeeps(): Promise<TvlEntry[]> {
    let tvl: any = [];
    let complete = false;
    let skip = 0;
    while (!complete) {
        const t = await getUpKeeps(skip);
        tvl = tvl.concat(t);
        if (t.length < 1000) {
            complete = true;
        } else {
            skip += 1000;
        }
    }
    return formatUpKeeps(tvl);
}

export async function fetchTvl() {
    return await getAllUpKeeps();
}

// Update token${ direction } from poolList api instead of hardcoding
async function getSwaps(direction: string, skip: number, addresses: string[]) {
    const query = gql`
      query {
        swaps(
          first: 1000
          skip: ${skip}
          where: { 
            token${direction}_in: [
                ${addresses.map((a) => `"${a}"`)}
              ] 
          }
        ) 
        {
          token${direction}
          tokenAmount${direction === 'In' ? 'Out' : 'In'}
          timestamp
        }
      }`;
    const response = await request('https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2', query);
    return response.swaps;
}

function formatSwaps(swaps: any[]) {
    return swaps.map((s) => {
        return {
            address: s.tokenIn ? s.tokenIn : s.tokenOut,
            volume: s.tokenAmountIn ? Number(s.tokenAmountIn) : Number(s.tokenAmountOut),
            timestamp: s.timestamp,
        };
    });
}

export async function getAllSecondaryLiquiditySwaps(addresses: string[]): Promise<TvlEntry[]> {
    let swaps: any[] = [];
    for (const direction of ['In', 'Out']) {
        let complete = false;
        let skip = 0;
        while (!complete) {
            const s = await getSwaps(direction, skip, addresses);
            swaps = swaps.concat(s);
            if (s.length < 1000 || skip >= 5000) {
                complete = true;
            } else {
                skip += 1000;
            }
        }
    }
    return formatSwaps(swaps);
}

// TODO
export function getEuroToUsd() {
    return 1.5;
}
