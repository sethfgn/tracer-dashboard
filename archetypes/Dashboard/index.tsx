import React from 'react';
import {
    PoolSeries,
    fetchTradeHistory,
    TradeHistoryEntry,
    TradeHistoryMap,
    fetchTvl,
    TvlEntry,
} from '../../libs/utils/poolsApi';
import { Button, Dropdown } from '@tracer-protocol/tracer-ui';
import ChartCard from '../../components/ChartCard/index';
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
    const [tradeHistory, setTradeHistory] = React.useState<TradeHistoryMap>();
    const [tvl, setTvl] = React.useState<TvlEntry[]>();

    const [pool, setPool] = React.useState<string>('3L-ETH/USD+USDC');
    const [poolOptions, setPoolOptions] = React.useState<string[]>([]);

    async function getLineData() {
        const tradeHistoryTemp = await fetchTradeHistory();
        setTradeHistory(tradeHistoryTemp);

        const poolOptionsList = Object.keys(tradeHistoryTemp);
        setPool(poolOptionsList[0]);
        setPoolOptions(poolOptionsList);
    }

    async function getTvlData() {
        fetchTvl()
            .then((c) => c.sort((x, y) => x.timestamp - y.timestamp))
            .then(setTvl);
    }

    React.useEffect(() => {
        getLineData();
        getTvlData();
    }, []);

    return (
        <div className="container">
            {/* Header */}
            <div className="m-5 mt-10 flex overflow-x-auto whitespace-nowrap">
                <div className="mr-5 flex items-center">
                    <div className="whitespace-nowrap shrink-0">Selected Market</div>
                </div>
                {/* TODO: @tracer-protocol/tracer-ui dropdown needs absolute layout to display; seems wonky */}
                <div className="mr-5">
                    <div className="absolute" style={{ marginTop: -52.5 }}>
                        <Dropdown previewText={pool || 'Loading...'} options={poolOptions} onClickOption={setPool} />
                    </div>
                </div>
                <div style={{ marginLeft: 180 }}>
                    <Button size="medium" variant="focus">
                        View All
                    </Button>
                </div>
            </div>
            {/* Mini dashboards */}
            <div className="flex mt-12 mb-10 flex-col lg:flex-row">
                <div className="box lg:w-1/3">
                    <ChartCard title="Total Value Locked" data={tvl} />
                </div>
                <div className="m-2" />
                <div className="box lg:w-1/3">
                    <ChartCard title="Total National Locked" data={tvl} transform={(num) => num * 3} />
                </div>
                <div className="m-2" />
                <div className="box lg:w-1/3">
                    <ChartCard title="All Time Volume" data={tvl} />
                </div>
            </div>
            {/* Big dashboard */}
            <BigChartCard title="Cumulative Volume Changes" poolData={tradeHistory?.[pool]} />
            <div className="mb-20" />
        </div>
    );
}) as React.FC<any>;
