import React, { useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { HistoryData } from 'libs/types/TracerTypes';
import styled from 'styled-components';
import Icon from '@ant-design/icons';

// @ts-ignore
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';

const ChartWrapper = dynamic(import('@components/Charts/'), { ssr: false });
// @ts-ignore
// @ts-nocheck
const setGraphOptions: (positionGraph, setPosition) => Record<string, unknown> = (positionGraph, setPosition) => {
    const data: Record<string, unknown> = {
        options: {
            alignLabels: true,
            timeScale: {
                rightOffset: 1,
                barSpacing: 3,
                fixLeftEdge: true,
                fixRightEdge: true,
                lockVisibleTimeRangeOnResize: true,
                rightBarStaysOnScroll: true,
                borderVisible: false,
                borderColor: '#0C3586',
                visible: true,
                timeVisible: true,
                secondsVisible: false,
                autoScale: true,
            },
            grid: {
                vertLines: {
                    color: 'rgba(12, 53, 134, 1)',
                    style: 1,
                    visible: true,
                },
                horzLines: {
                    color: 'rgba(12, 53, 134, 1)',
                    style: 1,
                    visible: true,
                },
            },
            crosshair: {
                vertLine: {
                    color: '#37B1F6',
                },
                horzLine: {
                    color: '#37B1F6',
                },
            },
            priceScale: {
                borderColor: '#37B1F6',
                // visible: showSeries,
                position: setPosition,
            },
            // @ts-ignore
            timeScale: {
                borderColor: '#37B1F6',
                visible: positionGraph,
            },
            layout: {
                textColor: '#696969',
                fontFamily: 'Akkurat',
                backgroundColor: 'transparent',
            },
        },
    };
    return data;
};

const StyledIcon = styled(Icon)`
    position: absolute;
    margin: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
`;

interface PLCProps {
    historyData: HistoryData;
    positionGraph: boolean;
    setPosition?: string;
    liquidationPrice?: number;
}
const LightWeightLineChart: React.FC<PLCProps> = ({
    historyData,
    positionGraph,
    setPosition,
    liquidationPrice,
}: PLCProps) => {
    const [graphData, setGraphData] = useState<Record<string, unknown>>();
    const hasReset = useRef<boolean>(false);
    useMemo(() => {
        if (historyData.length) {
            setGraphData({
                ...setGraphOptions(positionGraph, setPosition),
                lineSeries: [
                    {
                        data: historyData,
                    },
                ],
            });
            hasReset.current = false;
        } else {
            if (!hasReset.current) {
                setGraphData({
                    ...setGraphOptions(positionGraph, setPosition),
                });
                hasReset.current = true;
            }
        }
    }, [historyData]);

    const now = Math.floor(Date.now() / 1000); // timestamp in seconds
    const twoHour = 2 * 60 * 60; // two hours in seconds

    // Get first date in the data to specify graph data startpoint
    // const oldestDate = new Date(Date.UTC(historyData[0].time.year,
    //                                     historyData[0].time.month,
    //                                     historyData[0].time.day
    // ));

    // Convert the date to timestamp in seconds
    // const fromTime = Math.floor(oldestDate.getTime() / 1000);

    if (!graphData || !(graphData?.lineSeries as any[])?.length) {
        return <StyledIcon component={TracerLoading} className="tracer-loading" />;
    } else {
        return (
            <ChartWrapper
                options={graphData.options as Record<string, unknown>}
                from={now + twoHour}
                to={now - twoHour}
                lineSeries={graphData.lineSeries as any[]}
                autoWidth
                autoHeight
                positionGraph={positionGraph}
                liquidationPrice={liquidationPrice}
            />
        );
    }
};

export default LightWeightLineChart;
