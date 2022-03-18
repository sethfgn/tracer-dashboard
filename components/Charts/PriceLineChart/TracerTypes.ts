// import Tracer from '@libs/Tracer';
import { BigNumber } from 'bignumber.js';

/**
 * User balances of a Tracer
 */
export type UserBalance = {
    quote: BigNumber; // the accounts deposited funds
    base: BigNumber; // the position the user currently has
    totalLeveragedValue: BigNumber;
    lastUpdatedGasPrice: BigNumber;
    tokenBalance: BigNumber;
    leverage: BigNumber; // the users current leverage
    totalMargin: BigNumber; // the users current totalMargin
    minimumMargin: BigNumber; // the users current minimumMargin
    availableMarginPercent: BigNumber; // the users current minimumMargin
};

/**
 * Funding Rate type
 */
export type FundingRate = {
    recordTime: number;
    recordPrice: number;
    fundingRate: number;
    fundingRateValue: number;
};

/**
 * Candle data for a Tracer market. Used for graph on advanced trading page.
 */
export type CandleData = {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}[];

export type LineData = {
    time: string;
    value: number;
}[];

export type HistoryData = {
    time: string;
    value: number;
}[];

// export type LabelledTracers = Record<string, Tracer & { loading: boolean }>;

/** Graph tracer types */

export type MarginTransaction = {
    id: string;
    amount: string;
    timestamp: string;
    transactionType: 'DEPOSIT' | 'WITHDRAW';
    tracer: {
        marketId: string;
    };
};
