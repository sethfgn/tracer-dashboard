import Container from '@components/General/Container';

//mt-12
export default (() => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row mb-10 container">
                {['Total Value Locked', 'Total National Locked', 'All Time Value']
                    .map((e) => (
                        <div className="box h-32 w-1/3 p-5 mt-12">
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
