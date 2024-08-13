import axios from 'axios';

const fetchChange = async () => {
    const getChanges = async () => {
        try {
            const res = await axios.get(`https://fapi.binance.com/fapi/v1/ticker/24hr`, {
                headers: {
                    'content-type': 'application/json',
                }
            });
            return res.data;
    
        }
        catch(e) {
            console.log(e);
        }
    }
    const price_changes = await getChanges();
    let losers_accum = 0;
    let winners_accum = 0;
    
    for(let i = 0; i < price_changes.length; i++) {
        if(price_changes[i].priceChangePercent >= 0) {
            winners_accum++;
        }
        else {
            losers_accum++;
        }
    }
    
    const advance_decline_line = winners_accum - losers_accum;
    const total_binance_futures_assets = winners_accum + losers_accum;

    return {
        adl: advance_decline_line,
        total_assets: total_binance_futures_assets,
        winners_accum,
        losers_accum
    }
}

export default fetchChange;



// console.log('');
// console.log(`Total 24hr POSITIVE percent change: ${winners_accum}`);
// console.log(`Total 24hr NEGATIVE percent change: ${losers_accum}`);
// console.log(`Total Binance Futures Assets: ${winners_accum + losers_accum}`);
// console.log('');
// console.log(`Advance Decline Line: ${advance_decline_line} `);
// console.log('');
