import React from 'react';
import GreyContainer from '@components/GreyContainer';
// import PriceLineChart from '@components/Charts/PriceLineChart/index';
import { fetchTvlSeries, TvlDataPoint } from '../../libs/utils/totalValueLockedAPI';
// import ChartWrapper from '@components/Charts';
import { AxisOptions, Chart } from 'react-charts';
import { Button, Card } from '@tracer-protocol/tracer-ui';
import { classNames } from '../../libs/utils/functions';

//mt-12
//"mt-5 flex overflow-x-auto whitespace-nowrap"
export default (() => {
    const [lineData, setLineData] = React.useState<TvlDataPoint[]>();

    async function getLineData() {
        const tvlSeries = await fetchTvlSeries();
        const newLineData = tvlSeries[Object.keys(tvlSeries)[0]];
        setLineData(newLineData.splice(0, 100));
    }

    React.useEffect(() => {
        getLineData();
    }, []);

    const primaryAxis = React.useMemo(
        (): AxisOptions<TvlDataPoint> => ({
            getValue: (datum) => new Date(Number(datum.time_stamp)),
            scaleType: 'time',
            padBandRange: false,
        }),
        [],
    );

    const secondaryAxes = React.useMemo(
        (): AxisOptions<TvlDataPoint>[] => [
            {
                getValue: (datum) => datum.tvl,
                elementType: 'line',
            },
        ],
        [],
    );

    return (
        <div className="container">
            {/* Header */}
            <div className="mt-5 flex overflow-x-auto whitespace-nowrap">
                <div className="mt-5 flex overflow-x-auto whitespace-nowrap">
                    <div className="mr-5 flex items-center">
                        <div className="whitespace-nowrap shrink-0">Selected Market</div>
                    </div>
                    <div className="mr-5">
                        <Button size="medium" variant="action">
                            Short 3xBTC
                        </Button>
                    </div>
                    <div>
                        <Button size="medium" variant="focus">
                            View All
                        </Button>
                    </div>
                </div>
            </div>
            {/* Mini dashboards */}
            <div className="flex flex-row mb-10">
                {['Total Value Locked', 'Total National Locked', 'All Time Value']
                    .map((e) => (
                        <div key={e} className="box w-1/3 mt-12">
                            <Card>
                                {e}
                                <div className="p-24" />
                            </Card>
                        </div>
                    ))
                    .reduce((prev, curr) => (
                        <>
                            {prev}
                            <div className="m-6" />
                            {curr}
                        </>
                    ))}
            </div>
            {/* Big dashboard */}
            <Card>
                <div className="w-96 flex-col mb-5 ml-5">
                    <GreyContainer>Hello JW</GreyContainer>
                    <GreyContainer>Hello JW</GreyContainer>
                    <GreyContainer>Hello JW</GreyContainer>
                </div>
                <div className="p-24">Cumulative Volume Changes</div>
                {lineData ? (
                    <Chart
                        options={{
                            data: [
                                {
                                    label: 'React Charts',
                                    data: lineData,
                                },
                            ],
                            primaryAxis,
                            secondaryAxes,
                        }}
                    />
                ) : (
                    <div>Loading...</div>
                )}
            </Card>
        </div>
    );
}) as React.FC<any>;
