const balance = Number(process.argv[2]);
const rate = Number(process.argv[3]);
const period = Number(process.argv[4]);
const result = balance * Math.pow((1+rate),period)

console.log(`Final amount: ${result}`)