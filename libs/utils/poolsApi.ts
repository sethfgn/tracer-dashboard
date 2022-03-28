import * as dummy_data from './example_tracer_data.json';

const BASE_TVL_API = process.env.NEXT_PUBLIC_BASE_TVL_API;

export type TvlDataPoint = {
    time_stamp: string; // unix timestamp (seconds)
    tvl: number;
};

type Interval = 'Short' | 'Long';
type Leverage = '1' | '3';
type Chain = 'BTC' | 'ETH' | 'SOL';

// type Series = 'tvl' | 'mint' | 'burn' | 'secondary-liquidity';

export type PoolSeries = {
    [pool in `${Interval} ${Leverage}x${Chain}`]: {
        tvl: {
            time_stamp: string; // unix timestamp (seconds)
            tvl: number;
        }[];
        mint: {
            time_stamp: string; // unix timestamp (seconds)
            mint: number;
        }[];
        burn: {
            time_stamp: string; // unix timestamp (seconds)
            burn: number;
        }[];
        'secondary-liquidity': {
            time_stamp: string; // unix timestamp (seconds)
            'secondary-liquidity': number;
        }[];
    };
};

export const fetchPoolSeries: () => Promise<PoolSeries> = async () => {
    const route = `${BASE_TVL_API}/unknown/path`;

    return await fetch(route)
        .then((res) => res.json())
        .catch(() => dummy_data);
};

// @ts-ignore
const bruh: PoolSeries = {};
