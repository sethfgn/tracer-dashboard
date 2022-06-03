import React from 'react';
import { Dropdown } from '@components/General/Dropdown';
import { Card } from '@tracer-protocol/tracer-ui';
import { LogoTicker } from '../General/Logo/index';
import { getEuroToUsd, Series, TradeHistorySeriesMap } from '@libs/utils/poolsApi';
import { AxisOptions } from 'react-charts/types/types';
import { Chart } from 'react-charts';
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
//import GreyContainer from '@components/GreyContainer';
import Button from '@components/General/Button';
import { usdFormatter } from '@components/ChartCard';
import TimeIntervalButton, { TimeFrame, timeFrameOptions } from '@components/TimeIntervalButtons';

const currencyOptions: LogoTicker[] = ['USDC', 'EUR'];

interface ChartCardProps {
    title: string;
    poolData?: TradeHistorySeriesMap;
    transform?: number;
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
        () => (num: number) => num * (props.transform ?? 1) * (currency === 'EUR' ? getEuroToUsd() : 1),
        [props.transform, currency],
    );

    React.useEffect(() => {
        if (props.poolData) {
            if (timeFrame === 'All') {
                setStartInd(0);
            } else {
                const startUnixTime =
                    props.poolData[series][props!.poolData[series]!.length - 1].timestamp - timeIntervalDict[timeFrame];
                let ind = 0;

                while (props.poolData[series][ind].timestamp < startUnixTime) {
                    ind++;
                }

                console.log('ind', ind);
                setStartInd(ind);
            }
        }
    }, [props.poolData, timeFrame, series]);

    const primaryAxis = React.useMemo(
        (): AxisOptions<any> => ({
            getValue: (datum) => new Date(datum.timestamp),
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
                getValue: (datum) => transform(datum.volume),
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
                                          transform(props.poolData.mint[props.poolData.mint?.length - 1]?.volume),
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
                                          transform(props.poolData.burn[props.poolData.burn?.length - 1]?.volume),
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
                                              ]?.volume,
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
                                        data: props.poolData?.[series],
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
            <div className="flex flex-row justify-end items-center">
                <div className="flex justify-end items-center">
                    <div className="mr-2">
                        <div>
                            <TimeIntervalButton
                                options={timeFrameOptions}
                                onSelect={setTimeFrame}
                                default="Monthly"
                            ></TimeIntervalButton>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BigChartCard;
