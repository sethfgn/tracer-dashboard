import React from 'react';
import GreyContainer from '@components/GreyContainer';
// import PriceLineChart from '@components/Charts/PriceLineChart/index';
import { fetchTvlSeries, TvlDataPoint } from '../../libs/utils/totalValueLockedAPI';
// import ChartWrapper from '@components/Charts';
import { AxisOptions, Chart } from 'react-charts';
import { Button, Card } from '@tracer-protocol/tracer-ui';
//import { Dropdown } from '@components/General/Dropdown';
import ChartCard from '../../components/ChartCard/index';
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';
import styled from 'styled-components';
import Icon from '@ant-design/icons';

const StyledIcon = styled(Icon)`
    position: absolute;
    margin: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
`;

export default (() => {
    const [tvlData, setTvlData] = React.useState<TvlDataPoint[]>();

    async function getLineData() {
        const tvlSeries = await fetchTvlSeries();
        const newTvlData = tvlSeries[Object.keys(tvlSeries)[0]];
        setTvlData(newTvlData.splice(10, 1500));
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
            <div className="flex mt-12 mb-10 flex-col lg:flex-row">
                <div className="box lg:w-1/3">
                    <ChartCard title="Total Value Locked" data={tvlData} />
                </div>
                <div className="m-2" />
                <div className="box lg:w-1/3">
                    <ChartCard title="Total National Locked" data={tvlData} transform={(num) => num * 3} />
                </div>
                <div className="m-2" />
                <div className="box lg:w-1/3">
                    <ChartCard title="All Time Value" data={tvlData} />
                </div>
            </div>
            {/* Big dashboard */}
            <Card padding="sm">
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
                        {tvlData ? (
                            <Chart
                                options={{
                                    data: [
                                        {
                                            label: 'TVL',
                                            data: tvlData,
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
                </div>
            </Card>
            <div className="mb-20" />
        </div>
    );
}) as React.FC<any>;
