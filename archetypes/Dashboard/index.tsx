import React from 'react';
import Container from '@components/General/Container';
import Button from '@components/General/Button';

//mt-12
export default (() => {
    return (
        <div className="flex flex-col container">
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
                                <div className="p-20" />
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
                    <Container>Hi</Container>
                </div>
            </div>
        </div>
    );
}) as React.FC<any>;
