import React from 'react';
import GreyContainer from '@components/GreyContainer';
// import PriceLineChart from '@components/Charts/PriceLineChart/index';
import { fetchPoolSeries, TvlDataPoint, PoolSeries, PoolType } from '../../libs/utils/poolsApi';
// import ChartWrapper from '@components/Charts';
import { AxisOptions, Chart } from 'react-charts';
import { Button, Card } from '@tracer-protocol/tracer-ui';
//import { Dropdown } from '@components/General/Dropdown';
import ChartCard from '../../components/ChartCard/index';
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
import BigChartCard from '@components/BigChartCard';

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
    const [pool, setPool] = React.useState<PoolType>();

    async function getLineData() {
        const poolSeries = await fetchPoolSeries();

        const defaultPool = Object.keys(poolSeries)[0] as PoolType;
        setPool(defaultPool);

        const newTvlData = poolSeries[defaultPool].tvl;
        setTvlData(newTvlData);
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
                        {pool}
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
            <BigChartCard title="Hello World" data={tvlData} />
            <div className="mb-20" />
        </div>
    );
}) as React.FC<any>;
