import axios from 'axios';
import 'dotenv/config'

const getAssetCategory = (market_cap) => {
    // Categorias em milhões
    if(market_cap <= 50) {
        return 'NANO';
    }
    else if(market_cap <= 100) {
        return 'MICRO';
    }
    else if(market_cap <= 500) {
        return 'SMALL';
    }
    else if(market_cap <= 1000) {
        return 'MID';
    }
    else if(market_cap <= 5000) {
        return 'LARGE';
    }
    else if(market_cap <= 10000) {
        return 'MEGA10B';
    }
    else if(market_cap <= 100000) {
        return 'MEGA100B';
    }
    else if(market_cap <= 2000000) {
        return 'ULTRA';
    }
}

const getBinanceSignals = async () => {
    try {
        const res = await axios.get(`https://fapi.binance.com/fapi/v1/ticker/24hr`, {
            headers: {
                'content-type': 'application/json',
            }
        });
        const data = res.data;
        let binance_futures_symbols = [];
        let last24h_info = {};

        for(let i = 0; i < data.length; i++) {
            const symbol = data[i].symbol.slice(0, -4).toUpperCase();
            const priceChangePercent = Number(data[i].priceChangePercent);
            const volume = data[i].volume;
            const highPrice = data[i].highPrice;
            const lowPrice = data[i].lowPrice; 

            binance_futures_symbols.push(symbol);
            last24h_info[symbol] = {
                'priceChangePercent': priceChangePercent,
                'volume': volume,
                'highPrice': highPrice,
                'lowPrice': lowPrice
            };
        }

        return [binance_futures_symbols, last24h_info];

    }
    catch(e) {
        console.log(e);
    }
}

const getFuturesSignals = async () => {
    try {

        const signals = await getBinanceSignals();
        const binance_futures_symbols = signals[0];
        const res = await axios.get(`https://api.cryptorank.io/v1/currencies?symbols=${binance_futures_symbols}&api_key=${process.env.CRYPTORANK_API_KEY}`, {
            headers: {
                'content-type': 'application/json',
            }
        });
        const data = res.data;

        for(let i = 0; i < Object.keys(data['data']).length; i++) {
            const market_cap = data['data'][String(i)]['values']['USD']['marketCap'];
            const market_cap_normalized = Math.floor(market_cap/10**6);
            const market_cap_category = getAssetCategory(market_cap_normalized);
            const last24BinanceFutures = signals[1][ data['data'][String(i)]['symbol']]

            data['data'][String(i)]['marketCapNormalized'] = market_cap_normalized;
            data['data'][String(i)]['marketCapCategory'] = market_cap_category;
            data['data'][String(i)]['priceChangePercent'] = last24BinanceFutures['priceChangePercent'];
            data['data'][String(i)]['last24hVolume'] = last24BinanceFutures['volume'];
            data['data'][String(i)]['last24HighPrice'] = last24BinanceFutures['highPrice'];
            data['data'][String(i)]['last24hLowPrice'] = last24BinanceFutures['lowPrice'];
        }

        //console.log(Object.fromEntries(Object.entries(data['data']).slice(0,10)));

        return data;
    }
    catch(e) {
        console.log(e);
    }
}

const organizeData = async () => {
    const data = await getFuturesSignals();
    let organized = {
        'NANO': [],
        'MICRO': [],
        'SMALL': [],
        'MID': [],
        'LARGE': [],
        'MEGA10B': [],
        'MEGA100B': [],
        'ULTRA': []
    };

    for(let i = 0; i < Object.keys(data['data']).length; i++) {
        organized[data['data'][String(i)]['marketCapCategory']].push(data['data'][String(i)]);
        organized[data['data'][String(i)]['marketCapCategory']] = organized[data['data'][String(i)]['marketCapCategory']].sort(
            (a, b) => b.priceChangePercent - a.priceChangePercent
        )
    }

    return organized;
}

const organized_data = await organizeData();
console.log(organized_data)