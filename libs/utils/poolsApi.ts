import * as dummy_data from './example_tracer_data.json';
import axios from 'axios';
import { TradeHistory } from './tradeHistoryAPI';

const BASE_TVL_API = process.env.NEXT_PUBLIC_BASE_TVL_API;
const requestURL = 'https://api.tracer.finance/poolsv2/';
const networkId = '42161';

type Interval = 'Short' | 'Long';
type Leverage = '1' | '3';
type Chain = 'BTC' | 'ETH' | 'SOL';

export type Series = 'tvl' | 'mint' | 'burn' | 'secondary-liquidity';

export type PoolType = `${Interval} ${Leverage}x${Chain}`;

export type PoolSeries = {
    [pool in PoolType]: {
        [s in Series]: {
            [key in s]: number;
        }[] &
            {
                time_stamp: string; // unix timestamp (seconds)
            }[];
    };
};

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

export interface TradeHistoryEntry {
    address: string;
    timestamp: number;
    pool: string;
    type: Series;
    volume: number;
}

export type TradeHistorySeriesMap = {
    [type in Series]: TradeHistoryEntry[];
};

export type TradeHistoryMap = {
    [x: string]: TradeHistorySeriesMap;
};

export const fetchPoolSeries: () => Promise<PoolSeries> = async () => {
    const route = `${BASE_TVL_API}/unknown/path`;

    return await fetch(route)
        .then((res) => res.json())
        .catch(() => dummy_data);
};

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
    return formatTrades(resp.data.rows);
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

function formatTrades(trades: TradeHistoryEntryRaw[]) {
    const tradeHistoryMap: TradeHistoryMap = {};
    for (const trade of trades) {
        const type = trade.type;
        if (type.includes('Burn')) {
            if (!tradeHistoryMap[trade.tokenInSymbol]) {
                tradeHistoryMap[trade.tokenInSymbol] = { mint: [], burn: [], 'secondary-liquidity': [], tvl: [] };
            }
            tradeHistoryMap[trade.tokenInSymbol].burn.push(parseBurn(trade));
        }
        if (type.includes('Mint')) {
            if (!tradeHistoryMap[trade.tokenOutSymbol]) {
                tradeHistoryMap[trade.tokenOutSymbol] = { mint: [], burn: [], 'secondary-liquidity': [], tvl: [] };
            }
            tradeHistoryMap[trade.tokenOutSymbol].mint.push(parseMint(trade));
        }
    }
    return tradeHistoryMap;
}
