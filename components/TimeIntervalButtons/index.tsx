import React, { useState } from 'react';
import { Button } from '@tracer-protocol/tracer-ui';

export type TimeFrame = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | '3 Months' | 'Yearly' | 'All';

export const timeFrameOptions: TimeFrame[] = ['Hourly', 'Daily', 'Weekly', 'Monthly', '3 Months', 'Yearly', 'All'];

interface TimeIntervalButtonProps {
    options: TimeFrame[];
    onSelect: (option: TimeFrame) => void;
    default?: TimeFrame;
}

const TimeIntervalButton = (props: TimeIntervalButtonProps) => {
    const [selectedButtonColor, setSelectedButtonColor] = useState<TimeFrame>(props.default ?? 'Monthly');

    return (
        <div className="flex flex-row pt-2">
            {props.options
                .map((o) => (
                    <>
                        <Button
                            onClick={() => {
                                setSelectedButtonColor(o);
                                props.onSelect(o);
                            }}
                            size="small"
                            variant={o === selectedButtonColor ? 'action' : 'focus'}
                        >
                            {o}
                        </Button>
                    </>
                ))
                .reduce((prev, curr) => (
                    <>
                        {prev}
                        <div className="p-1" />
                        {curr}
                    </>
                ))}
        </div>
    );
};

export default TimeIntervalButton;
