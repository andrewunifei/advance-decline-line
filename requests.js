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
    let volume_winners = 0;
    let volume_losers = 0;
    const filter = ['BTCUSDT', 'BTCUSDC', 'ETHUSDT', 'SOLUSDT']
    
    for(let i = 0; i < price_changes.length; i++) {
        if(Number(price_changes[i].priceChangePercent) >= 0) {
            winners_accum++;
            if(!filter.includes(price_changes[i].symbol)) {
                volume_winners = volume_winners + Number(price_changes[i].volume);
            }
        }
        else {
            losers_accum++;
            if(!filter.includes(price_changes[i].symbol)){
                volume_losers = volume_losers + Number(price_changes[i].volume);
            }
        }
    }
    
    const advance_decline_line = winners_accum - losers_accum;
    const vold_up_calc = volume_winners / volume_losers;
    const vold_down_calc = volume_losers / volume_winners ;
    const total_binance_futures_assets = winners_accum + losers_accum;
    let vold_up;
    let vold_down;

    if(vold_up_calc < 1) {
        vold_up = Math.round(vold_up_calc * 100);
        vold_up = String(vold_up) + '% do volume losers';
        vold_down = String(Math.round(vold_down_calc * 100) / 100) + 'x o volume winners';
    }
    else if(vold_down_calc < 1){
        vold_down = Math.round(vold_down_calc * 100);
        vold_down = String(vold_down) + '% do volume winners';
        vold_up = String(Math.round(vold_up_calc * 100) / 100) + 'x o volume losers';
    }

    return {
        adl: advance_decline_line,
        vold_up,
        vold_down,
        total_assets: total_binance_futures_assets,
        winners_accum,
        losers_accum
    }
}

export default fetchChange;