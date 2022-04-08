import React from 'react';
//import GreyContainer from '@components/GreyContainer';
// import PriceLineChart from '@components/Charts/PriceLineChart/index';
import { fetchPoolSeries, PoolType, PoolSeries } from '../../libs/utils/poolsApi';
// import ChartWrapper from '@components/Charts';
//import { AxisOptions, Chart } from 'react-charts';
import { Button } from '@tracer-protocol/tracer-ui';
//import { Dropdown } from '@components/General/Dropdown';
import ChartCard from '../../components/ChartCard/index';
//import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';
//import styled from 'styled-components';
//import Icon from '@ant-design/icons';
import BigChartCard from '@components/BigChartCard';

// const StyledIcon = styled(Icon)`
//     position: absolute;
//     margin: auto;
//     left: 50%;
//     top: 50%;
//     transform: translate(-50%, -50%);
//     width: 32px;
//     height: 32px;
// `;

export default (() => {
    const [poolSeries, setPoolSeries] = React.useState<PoolSeries>();
    const [pool, setPool] = React.useState<PoolType>('Short 1xBTC');

    async function getLineData() {
        const newPoolSeries = await fetchPoolSeries();

        const defaultPool = Object.keys(newPoolSeries)[0] as PoolType;
        setPool(defaultPool);
        setPoolSeries(newPoolSeries);
    }

    React.useEffect(() => {
        getLineData();
    }, []);

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
                    <ChartCard title="Total Value Locked" data={poolSeries?.[pool].tvl} />
                </div>
                <div className="m-2" />
                <div className="box lg:w-1/3">
                    <ChartCard
                        title="Total National Locked"
                        data={poolSeries?.[pool].tvl}
                        transform={(num) => num * 3}
                    />
                </div>
                <div className="m-2" />
                <div className="box lg:w-1/3">
                    <ChartCard title="All Time Volume" data={poolSeries?.[pool].tvl} />
                </div>
            </div>
            {/* Big dashboard */}
            <BigChartCard title="Cumulative Volume Changes" poolData={poolSeries?.[pool]} />
            <div className="mb-20" />
        </div>
    );
}) as React.FC<any>;
