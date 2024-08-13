const start = (timeframe_config) => {
    const start = Date.now();
    const timeframe = timeframe_config * 60000;
    console.log(timeframe)
    while(1) {
        const relative_moment = Date.now();
        if(relative_moment - start >= timeframe) {
            console.log('Hello')
        }
    }
}

const timeframe_config = 1;
start(timeframe_config);