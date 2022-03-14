import Container from '@components/General/Container';

export default (() => {
    return (
        <div className="container mt-12 flex absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {['Total Value Locked', 'Total National Locked', 'All Time Value']
                .map((e) => <Container>{e}</Container>)
                .reduce((prev, curr) => (
                    <>
                        {prev}
                        <div className='m-6' />
                        {curr}
                    </>
                ))}
        </div>
    );
}) as React.FC<any>;
