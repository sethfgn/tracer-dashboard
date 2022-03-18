import dynamic from 'next/dynamic';

const TVChartContainer: any = dynamic(
    // @ts-ignore
    import('./TVChartContainer'),
    {
        ssr: false,
    },
);

export default TVChartContainer;
