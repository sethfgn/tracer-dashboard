import * as dummy_data from './example_tvl_data.json';

const BASE_TVL_API = process.env.NEXT_PUBLIC_BASE_TVL_API;

export type TvlDataPoint = {
    time_stamp: number;
    tvl: number;
};

export type TvlSeries = TvlDataPoint[];

export const fetchTvlSeries: () => Promise<TvlSeries> = async () => {
    const route = `${BASE_TVL_API}/unknown/path`;

    return await fetch(route)
        .then((res) => res.json())
        .catch(() => dummy_data);
};
