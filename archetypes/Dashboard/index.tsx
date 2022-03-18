import React from 'react';
import Button from '@components/General/Button';
import Container from '@components/General/Container';
import GreyContainer from '@components/GreyContainer';
import PriceLineChart from '@components/Charts/PriceLineChart/index';
import { fetchTvlSeries, TvlSeries } from '../../libs/utils/totalValueLockedAPI';
import { LineData } from '../../components/Charts/PriceLineChart/TracerTypes';

//mt-12
//"mt-5 flex overflow-x-auto whitespace-nowrap"
export default (() => {
    const [lineData, setLineData] = React.useState<LineData>();

    async function getLineData() {
        const tvlSeries = await fetchTvlSeries();
        const newLineData: LineData = tvlSeries[Object.keys(tvlSeries)[0]].map((tvlPoint) => {
            return {
                time: tvlPoint.time_stamp,
                value: tvlPoint.tvl,
            };
        });
        setLineData(newLineData.splice(0, 10));
    }

    React.useEffect(() => {
        getLineData();
    }, []);

    return (
        // <div className="relative flex w-full py-2 text-center bg-theme-background-nav-secondary matrix:bg-transparent">
        <div className="mr-5 container">
            <div className="flex flex-col">
                <div className="mt-5 flex overflow-x-auto whitespace-nowrap">
                    <div className="mr-5 flex items-center">
                        <div className="whitespace-nowrap shrink-0">Selected Market</div>
                    </div>
                    <div className="mr-5">
                        <Button size="default" variant="primary">
                            Short 3xBTC
                        </Button>
                    </div>
                    <div>
                        <Button size="default" variant="unselected">
                            View All
                        </Button>
                    </div>
                </div>
                <div className="flex flex-row mb-10">
                    {['Total Value Locked', 'Total National Locked', 'All Time Value']
                        .map((e) => (
                            <div key={e} className="box h-32 w-1/3 p-5 mt-12">
                                <Container>
                                    {e}
                                    <div className="p-24" />
                                </Container>
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
                <div className="flex flex-row mt-10">
                    <div className="h-32 p-5 container mt-12">
                        <Container>
                            <div className="p-24">Cumulative Volume Changes</div>
                            {/* <PriceLineChart lineData={lineData} /> */}
                        </Container>
                        <GreyContainer>Hello JW</GreyContainer>
                    </div>
                </div>
            </div>
        </div>
        //</div>
    );
}) as React.FC<any>;
