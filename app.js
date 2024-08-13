import fetchChange from "./requests.js";

const start = async (timeframe_config) => {
    const start = Date.now();
    const timeframe = timeframe_config * 60000;
    console.log(timeframe)
    while(1) {
        const relative_moment = Date.now();
        if(relative_moment - start >= timeframe) {
            const data = await fetchChange();
            console.log(data);
            break;
        }
    }
}

const timeframe_config = 0.25;
console.log(`Timeframe: ${1 * timeframe_config} minutes`)
await start(timeframe_config);