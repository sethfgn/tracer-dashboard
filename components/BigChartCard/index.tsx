import React from 'react';
import { Dropdown } from '@components/General/Dropdown';
import { Card } from '@tracer-protocol/tracer-ui';
import { LogoTicker } from '../General/Logo/index';
import { Series, TvlDataPoint } from '@libs/utils/poolsApi';
import { AxisOptions } from 'react-charts/types/types';
import { Chart } from 'react-charts';
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
import GreyContainer from '@components/GreyContainer';
import Button from '@components/General/Button';

const currencyOptions: LogoTicker[] = ['USDC', 'EUR'];

type TimeFrame = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | '3 Months' | 'Yearly' | 'All';

const timeFrameOptions: TimeFrame[] = ['Hourly', 'Daily', 'Weekly', 'Monthly', '3 Months', 'Yearly', 'All'];

interface ChartCardProps {
    title: string;
    data?: TvlDataPoint[];
    transform?: (arg: number) => number;
}

const StyledIcon = styled(Icon)`
    position: absolute;
    margin: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
`;

const timeIntervalDict: Record<TimeFrame, number> = {
    Hourly: 3600,
    Daily: 86400,
    Weekly: 604800,
    Monthly: 2592000,
    '3 Months': 7776000,
    Yearly: 31536000,
    All: 0,
};

const BigChartCard = (props: ChartCardProps) => {
    const [currency, setCurrency] = React.useState<LogoTicker>('USDC');
    const [timeFrame, setTimeFrame] = React.useState<TimeFrame>('Monthly');
    const [series, setSeries] = React.useState<Series>('mint');

    const [startInd, setStartInd] = React.useState<number>();

    const transform = React.useMemo(
        () => (props.transform ? (num: number) => props.transform!(num) : (num: number) => num),
        [props.transform],
    );

    React.useEffect(() => {
        if (props.data) {
            if (timeFrame === 'All') {
                setStartInd(0);
            } else {
                const startUnixTime =
                    Number(props.data[props!.data!.length - 1].time_stamp) - timeIntervalDict[timeFrame];
                let ind = 0;

                while (Number(props.data[ind].time_stamp) < startUnixTime) {
                    ind++;
                }

                console.log('ind', ind);
                setStartInd(ind);
            }
        }
    }, [props.data, timeFrame]);

    const primaryAxis = React.useMemo(
        (): AxisOptions<TvlDataPoint> => ({
            getValue: (datum) => new Date(Number(datum.time_stamp)),
            // scaleType: 'time',
            padBandRange: false,
            show: false,
            styles: { width: '50%' },
            shouldNice: false,
        }),
        [],
    );

    const secondaryAxes = React.useMemo(
        (): AxisOptions<TvlDataPoint>[] => [
            {
                getValue: (datum) => transform(datum.tvl),
                elementType: 'area',
                show: false,
                shouldNice: false,
            },
        ],
        [],
    );

    return (
        <Card padding="sm">
            <div className="flex">
                <div className="pb-2 font-semibold">Cumulative Volume Changes</div>
            </div>
            <div className="flex justify-end items-center">
                <div className="mr-2">
                    <Button size="sm" variant="primary">
                        View Balancer Stat
                    </Button>
                </div>
                <div className="w-28">
                    <Dropdown
                        size="xs"
                        placeHolder={currency}
                        placeHolderIcon={currency}
                        options={currencyOptions.map((c) => ({
                            key: c,
                            text: c,
                            ticker: c,
                        }))}
                        onSelect={(option) => setCurrency(option as LogoTicker)}
                        value={currency}
                    />
                </div>
                <div className="w-24">
                    <Dropdown
                        size="xs"
                        placeHolder={timeFrame}
                        options={timeFrameOptions.map((c) => ({
                            key: c,
                            text: c,
                        }))}
                        onSelect={(option) => setTimeFrame(option as TimeFrame)}
                        value={timeFrame}
                    />
                </div>
            </div>
            <div className="flex">
                <div className=" flex-initial flex-col">
                    <div
                        style={
                            series === 'mint'
                                ? {
                                      boxShadow: '-4px -3px 45px 21px rgba(0,0,0,0.35);',
                                  }
                                : {}
                        }
                    >
                        <div className="mt-5 px-5 pt-5 pb-5 rounded-xl bg-cool-gray-100 dark:bg-theme-background-secondary">
                            <div className="font-bold text-3xl">$400,000</div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-red-400 mr-1" />
                                <div className="font-bold text-base opacity-50">Total Mint</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 px-5 pt-5 pb-5 rounded-xl bg-cool-gray-100 dark:bg-theme-background-secondary">
                        <div className="font-bold text-3xl">$360,000</div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-400 mr-1" />
                            <div className="font-bold text-base opacity-50">Total Burn</div>
                        </div>
                    </div>
                    <div className="mt-5 px-5 pt-5 pb-5 rounded-xl bg-cool-gray-100 dark:bg-theme-background-secondary">
                        <div className="font-bold text-3xl">$40,000</div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-400 mr-1" />
                            <div className="font-bold text-base opacity-50">Total Secondary Liquidity</div>
                        </div>
                    </div>
                </div>
                {props.data ? (
                    <div className="flex-auto ml-5">
                        <Chart
                            options={{
                                data: [
                                    {
                                        label: props.title,
                                        data: props.data?.slice(startInd ?? 0, props.data.length),
                                    },
                                ],
                                primaryAxis,
                                secondaryAxes,
                            }}
                        />
                    </div>
                ) : (
                    <StyledIcon component={TracerLoading} className="tracer-loading" />
                )}
            </div>
        </Card>
    );
};

export default BigChartCard;
