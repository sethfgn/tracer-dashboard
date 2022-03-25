import React from 'react';
import { Dropdown } from '@components/General/Dropdown';
import { Card } from '@tracer-protocol/tracer-ui';
import { LogoTicker } from '../General/Logo/index';
import { TvlDataPoint } from '@libs/utils/totalValueLockedAPI';
import { AxisOptions } from 'react-charts/types/types';
import { Chart } from 'react-charts';
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';
import styled from 'styled-components';
import Icon from '@ant-design/icons';

const currencyOptions: LogoTicker[] = ['USDC', 'EUR'];

type TimeFrame = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | '3 Months' | 'Yearly' | 'All';

const timeFrameOptions: TimeFrame[] = ['Hourly', 'Daily', 'Weekly', 'Monthly', '3 Months', 'Yearly', 'All'];

interface ChartCardProps {
    title: string;
    data?: TvlDataPoint[];
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

export default function ChartCard(props: ChartCardProps) {
    const [currency, setCurrency] = React.useState<LogoTicker>('USDC');
    const [timeFrame, setTimeFrame] = React.useState<TimeFrame>('Monthly');

    const primaryAxis = React.useMemo(
        (): AxisOptions<TvlDataPoint> => ({
            getValue: (datum) => new Date(Number(datum.time_stamp)),
            scaleType: 'time',
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
                getValue: (datum) => datum.tvl,
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
            <div className="mt-3 mb-3 flex flex-row justify-between">
                <div className="font-bold text-3xl">$400,102,402</div>
                <div className="font-bold text-3xl text-green-600">4.13% ↑</div>
            </div>

            <div className="h-56">
                {props.data ? (
                    <Chart
                        options={{
                            data: [
                                {
                                    label: 'TVL',
                                    data: props.data,
                                },
                            ],
                            primaryAxis,
                            secondaryAxes,
                        }}
                    />
                ) : (
                    <StyledIcon component={TracerLoading} className="tracer-loading" />
                )}
            </div>
        </Card>
    );
}
