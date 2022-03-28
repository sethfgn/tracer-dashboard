// @ts-expect-error
const fs = require('fs');

const interval = ['Short', 'Long'];
const leverage = ['1', '3'];
const chain = ['BTC', 'ETH', 'SOL'];

const series = ['tvl', 'mint', 'burn', 'secondary-liquidity'];

const content = JSON.parse(fs.readFileSync('libs/utils/example_tvl_data.json'));

const rawData = content['0x146808f54DB24Be2902CA9f595AD8f27f56B2E76'];
// rawData.length = 23886

const data = {};

for (const i of interval) {
    for (const l of leverage) {
        for (const c of chain) {
            const marketKey = `${i} ${l}x${c}`;
            data[marketKey] = {};
            for (const s of series) {
                data[marketKey][s] = rawData.slice(0, 1000).map((p) => ({
                    time_stamp: p.time_stamp,
                    [s]: p.tvl,
                }));
            }
        }
    }
}

const json = JSON.stringify(data, null, 2);
fs.writeFileSync('libs/utils/example_tracer_data.json', json);
