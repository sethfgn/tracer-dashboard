import React from 'react';
import { Dropdown } from '@components/General/Dropdown';
import { Card } from '@tracer-protocol/tracer-ui';
import { LogoTicker } from '../General/Logo/index';

const currencyOptions: LogoTicker[] = ['USDC', 'EUR'];

type TimeFrame = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | '3 Months' | 'Yearly' | 'All';

const timeFrameOptions: TimeFrame[] = ['Hourly', 'Daily', 'Weekly', 'Monthly', '3 Months', 'Yearly', 'All'];

interface ChartCardProps {
    title: string;
}

export default function ChartCard(props: ChartCardProps) {
    const [currency, setCurrency] = React.useState<LogoTicker>('USDC');
    const [timeFrame, setTimeFrame] = React.useState<TimeFrame>('Monthly');

    return (
        <Card padding="sm">
            <div className="flex justify-between items-center">
                <div className="mr-2">{props.title}</div>
                <div className="flex justify-end">
                    <div className="mr-5">
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
                    <div className="">
                        <Dropdown
                            size="sm"
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
            <div className="p-24" />
        </Card>
    );
}
