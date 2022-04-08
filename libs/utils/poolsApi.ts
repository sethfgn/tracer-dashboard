import * as dummy_data from './example_tracer_data.json';

const BASE_TVL_API = process.env.NEXT_PUBLIC_BASE_TVL_API;

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

export const fetchPoolSeries: () => Promise<PoolSeries> = async () => {
    const route = `${BASE_TVL_API}/unknown/path`;

    return await fetch(route)
        .then((res) => res.json())
        .catch(() => dummy_data);
};
