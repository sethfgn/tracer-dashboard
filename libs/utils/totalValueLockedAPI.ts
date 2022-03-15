import * as dummy_data from './example_tvl_data.json';

const BASE_TVL_API = process.env.NEXT_PUBLIC_BASE_TVL_API;

export type TvlDataPoint = {
    time_stamp: string; // unix timestamp (seconds)
    tvl: number;
};

export type TvlSeries = {
    [ethAddress: string]: TvlDataPoint[];
};

export const fetchTvlSeries: () => Promise<TvlSeries> = async () => {
    const route = `${BASE_TVL_API}/unknown/path`;

    return await fetch(route)
        .then((res) => res.json())
        .catch(() => dummy_data);
};
