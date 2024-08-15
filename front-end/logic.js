const ctx = document.getElementById('myChart');

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Test'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

(async () => {
    try {
        const res = await axios.get(`https://fapi.binance.com/fapi/v1/ticker/24hr`, {
            headers: {
                'content-type': 'application/json',
            }
        });
        const newData = res.data[0].priceChangePercent;
        console.log(newData);
        chart.data.datasets[0].data.push(newData);
        chart.update();
    }
        catch(e) {
            console.log(e);
    }
})()


