import React from 'react';
import { Dropdown } from '@components/General/Dropdown';
import { Card } from '@tracer-protocol/tracer-ui';
import { LogoTicker } from '../General/Logo/index';
import { AxisOptions } from 'react-charts/types/types';
import { Chart } from 'react-charts';
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
import { TvlEntry, getEuroToUsd } from '../../libs/utils/poolsApi';

const currencyOptions: LogoTicker[] = ['USDC', 'EUR'];

type TimeFrame = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | '3 Months' | 'Yearly' | 'All';

const timeFrameOptions: TimeFrame[] = ['Hourly', 'Daily', 'Weekly', 'Monthly', '3 Months', 'Yearly', 'All'];

interface ChartCardProps {
    title: string;
    data?: TvlEntry[];
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

export const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export const percentFormatter = Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const timeIntervalDict: Record<TimeFrame, number> = {
    Hourly: 3600,
    Daily: 86400,
    Weekly: 604800,
    Monthly: 2592000,
    '3 Months': 7776000,
    Yearly: 31536000,
    All: 0,
};

export default function ChartCard(props: ChartCardProps) {
    const [currency, setCurrency] = React.useState<LogoTicker>('USDC');
    const [timeFrame, setTimeFrame] = React.useState<TimeFrame>('Monthly');

    const [startInd, setStartInd] = React.useState<number>();

    const transform = React.useMemo(
        () => (num: number) => num * (props.transform ?? 1) * (currency === 'EUR' ? getEuroToUsd() : 1),
        [props.transform, currency],
    );

    React.useEffect(() => {
        if (props.data) {
            if (timeFrame === 'All') {
                setStartInd(0);
            } else {
                const startUnixTime =
                    Number(props.data[props!.data!.length - 1].timestamp) - timeIntervalDict[timeFrame];
                let ind = 0;

                while (props.data[ind].timestamp < startUnixTime) {
                    ind++;
                }

                console.log('ind', ind);
                setStartInd(ind);
            }
        }
    }, [props.data, timeFrame]);

    const primaryAxis = React.useMemo(
        (): AxisOptions<TvlEntry> => ({
            getValue: (datum) => new Date(Number(datum.timestamp)),
            // scaleType: 'time',
            padBandRange: false,
            show: false,
            styles: { width: '50%' },
            shouldNice: false,
        }),
        [],
    );

    const secondaryAxes = React.useMemo(
        (): AxisOptions<TvlEntry>[] => [
            {
                getValue: (datum) => transform(datum.volume),
                elementType: 'area',
                show: false,
                shouldNice: false,
            },
        ],
        [],
    );

    return (
        <Card padding="sm">
            <div className="flex justify-between items-center">
                <div className="mr-2">{props.title}</div>
                <div className="flex justify-end items-center">
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
            {props.data ? (
                <>
                    <div className="mt-3 mb-3 flex flex-row justify-between">
                        <div className="font-bold text-3xl">
                            {usdFormatter.format(transform(props.data?.[props.data?.length - 1]?.volume))}
                        </div>
                        <div
                            className={`font-bold text-3xl ${
                                (transform(props.data[props.data?.length - 1]?.volume) -
                                    transform(props.data[startInd ?? 0]?.volume)) /
                                    transform(props.data[startInd ?? 0]?.volume) >=
                                0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}
                        >
                            {percentFormatter.format(
                                (transform(props.data[props.data?.length - 1]?.volume) -
                                    transform(props.data[startInd ?? 0]?.volume)) /
                                    transform(props.data[startInd ?? 0]?.volume),
                            )}{' '}
                            {(transform(props.data[props.data?.length - 1]?.volume) -
                                transform(props.data[startInd ?? 0]?.volume)) /
                                transform(props.data[startInd ?? 0]?.volume) >=
                            0
                                ? '↑'
                                : '↓'}
                        </div>
                    </div>

                    <div className="h-56">
                        <Chart
                            options={{
                                data: [
                                    {
                                        label: props.title,
                                        data: props.data.slice(startInd ?? 0, props.data.length),
                                    },
                                ],
                                primaryAxis,
                                secondaryAxes,
                            }}
                        />
                    </div>
                </>
            ) : (
                <div className="h-64 flex-auto">
                    <StyledIcon component={TracerLoading} className="tracer-loading" />
                </div>
            )}
        </Card>
    );
}
