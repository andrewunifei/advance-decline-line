import fetchChange from "./requests.js";

const start = async (timeframe_config) => {
    let start = Date.now();
    const timeframe = timeframe_config * 60000;
    while(1) {
        const relative_moment = Date.now();
        if(relative_moment - start >= timeframe) {
            start = Date.now();
            const data = await fetchChange();
            const timestamp = new Date(start);
            console.log(`${timestamp.toLocaleTimeString()} | \x1b[33mvold_up\x1b[0m: ${data.vold_up} ; \x1b[33mvold_down\x1b[0m: ${data.vold_down} ; \x1b[33madl\x1b[0m: ${data.adl} ; \x1b[32mwinners_accum\x1b[0m: ${data.winners_accum} ; \x1b[31mlosers_accum\x1b[0m: ${data.losers_accum} ; \x1b[34mtotal_assets\x1b[0m: ${data.total_assets}`);
        }
    }
}

const timeframe_config = Number(process.argv[2]);
console.log(`Timeframe: ${1 * timeframe_config} minute(s)`)
await start(timeframe_config);