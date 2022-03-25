import React from 'react';
import GreyContainer from '@components/GreyContainer';
// import PriceLineChart from '@components/Charts/PriceLineChart/index';
import { fetchTvlSeries, TvlDataPoint } from '../../libs/utils/totalValueLockedAPI';
// import ChartWrapper from '@components/Charts';
import { AxisOptions, Chart } from 'react-charts';
import { Button, Card } from '@tracer-protocol/tracer-ui';
//import { Dropdown } from '@components/General/Dropdown';
import ChartCard from '../../components/ChartCard/index';

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
            <div className="m-5 mt-10 flex overflow-x-auto whitespace-nowrap">
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
            {/* Mini dashboards */}
            <div className="flex mt-12 mb-10 flex-col md:flex-row">
                {['Total Value Locked', 'Total National Locked', 'All Time Value']
                    .map((e) => (
                        <div key={e} className="box md:w-1/3">
                            <ChartCard title={e} />
                        </div>
                    ))
                    .reduce((prev, curr) => (
                        <>
                            {prev}
                            <div className="m-2" />
                            {curr}
                        </>
                    ))}
            </div>
            {/* Big dashboard */}
            <Card>
                <div className="flex">
                    <div className="pb-2 font-semibold">Cumulative Volume Changes</div>
                </div>

                <div className="flex">
                    <div className=" flex-initial flex-col">
                        <GreyContainer>
                            <div className="font-bold text-3xl">$400,000</div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-red-400 mr-1" />
                                <div className="font-bold text-base opacity-50">Total Mint</div>
                            </div>
                        </GreyContainer>
                        <GreyContainer>
                            <div className="font-bold text-3xl">$360,000</div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-400 mr-1" />
                                <div className="font-bold text-base opacity-50">Total Burn</div>
                            </div>
                        </GreyContainer>
                        <GreyContainer>
                            <div className="font-bold text-3xl">$40,000</div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-400 mr-1" />
                                <div className="font-bold text-base opacity-50">Total Secondary Liquidity</div>
                            </div>
                        </GreyContainer>
                    </div>
                    <div className="flex-auto ml-5">
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
                    </div>
                </div>
            </Card>
            <div className="mb-20" />
        </div>
    );
}) as React.FC<any>;
