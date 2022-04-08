import React from 'react';
import { Dropdown } from '@components/General/Dropdown';
import { Card } from '@tracer-protocol/tracer-ui';
import { LogoTicker } from '../General/Logo/index';
import { Series, PoolSeries } from '@libs/utils/poolsApi';
import { AxisOptions } from 'react-charts/types/types';
import { Chart } from 'react-charts';
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
//import GreyContainer from '@components/GreyContainer';
import Button from '@components/General/Button';
import { usdFormatter } from '@components/ChartCard';

const currencyOptions: LogoTicker[] = ['USDC', 'EUR'];

type TimeFrame = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | '3 Months' | 'Yearly' | 'All';

const timeFrameOptions: TimeFrame[] = ['Hourly', 'Daily', 'Weekly', 'Monthly', '3 Months', 'Yearly', 'All'];

interface ChartCardProps {
    title: string;
    poolData: PoolSeries['Long 1xBTC'];
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
        if (props.poolData) {
            if (timeFrame === 'All') {
                setStartInd(0);
            } else {
                const startUnixTime =
                    Number(props.poolData[series][props!.poolData[series]!.length - 1].time_stamp) -
                    timeIntervalDict[timeFrame];
                let ind = 0;

                while (Number(props.poolData[series][ind].time_stamp) < startUnixTime) {
                    ind++;
                }

                console.log('ind', ind);
                setStartInd(ind);
            }
        }
    }, [props.poolData, timeFrame, series]);

    const primaryAxis = React.useMemo(
        (): AxisOptions<any> => ({
            getValue: (datum) => new Date(Number(datum.time_stamp)),
            // scaleType: 'time',
            padBandRange: false,
            show: false,
            styles: { width: '50%' },
            shouldNice: false,
        }),
        [series],
    );

    const secondaryAxes = React.useMemo(
        (): AxisOptions<any>[] => [
            {
                getValue: (datum) => transform(datum[series] as number),
                elementType: 'area',
                show: false,
                shouldNice: false,
            },
        ],
        [series],
    );

    return (
        <Card padding="sm">
            <div className="flex flex-row justify-between items-center">
                <div className="pb-2 font-semibold">{props.title}</div>
                <div className="flex justify-end items-center">
                    <div className="mr-2">
                        <Button size="xs" variant="primary">
                            <div style={{ padding: 4 }}>View Balancer Stat</div>
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
            </div>

            <div className="flex">
                <div className=" flex-initial flex-col">
                    <div
                        className="rounded-xl cursor-pointer"
                        onClick={() => setSeries('mint')}
                        style={
                            series === 'mint'
                                ? {
                                      boxShadow: '0px 0px 5px red',
                                  }
                                : {}
                        }
                    >
                        <div className="mt-5 px-5 pt-5 pb-5 rounded-xl bg-cool-gray-100 dark:bg-theme-background-secondary">
                            <div className="font-bold text-3xl">
                                {props.poolData
                                    ? usdFormatter.format(
                                          transform(props.poolData.mint[props.poolData.mint?.length - 1]?.mint),
                                      )
                                    : '$-.--'}
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-red-400 mr-1" />
                                <div className="font-bold text-base opacity-50">Total Mint</div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="rounded-xl cursor-pointer"
                        onClick={() => setSeries('burn')}
                        style={
                            series === 'burn'
                                ? {
                                      boxShadow: '0px 0px 5px blue',
                                  }
                                : {}
                        }
                    >
                        <div className="mt-5 px-5 pt-5 pb-5 rounded-xl bg-cool-gray-100 dark:bg-theme-background-secondary">
                            <div className="font-bold text-3xl">
                                {props.poolData
                                    ? usdFormatter.format(
                                          transform(props.poolData.burn[props.poolData.mint?.length - 1]?.burn),
                                      )
                                    : '$-.--'}
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-400 mr-1" />
                                <div className="font-bold text-base opacity-50">Total Burn</div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="rounded-xl cursor-pointer"
                        onClick={() => setSeries('secondary-liquidity')}
                        style={
                            series === 'secondary-liquidity'
                                ? {
                                      boxShadow: '0px 0px 5px green',
                                  }
                                : {}
                        }
                    >
                        <div className="mt-5 px-5 pt-5 pb-5 rounded-xl bg-cool-gray-100 dark:bg-theme-background-secondary">
                            <div className="font-bold text-3xl">
                                {props.poolData
                                    ? usdFormatter.format(
                                          transform(
                                              props.poolData['secondary-liquidity'][
                                                  props.poolData['secondary-liquidity'].length - 1
                                              ]?.['secondary-liquidity'],
                                          ),
                                      )
                                    : '$-.--'}
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-400 mr-1" />
                                <div className="font-bold text-base opacity-50">Total Secondary Liquidity</div>
                            </div>
                        </div>
                    </div>
                </div>
                {props.poolData?.[series] ? (
                    <div className="flex-auto ml-5">
                        <Chart
                            options={{
                                data: [
                                    {
                                        label: props.title,
                                        data: props.poolData[series]?.slice(
                                            startInd ?? 0,
                                            props.poolData[series].length,
                                        ),
                                    },
                                ],
                                primaryAxis,
                                secondaryAxes,
                                defaultColors: [
                                    series === 'secondary-liquidity' ? 'green' : series === 'mint' ? '#f00' : 'blue',
                                ],
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
