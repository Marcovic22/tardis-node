const { streamNormalized, normalizeBookChanges, combine, 
    compute, computeBookSnapshots } = require('tardis-dev')

async function processMessages() {
const exchangesToStream = [
{ exchange: 'bitmex', symbols: ['ETHUSD'] },
{ exchange: 'deribit', symbols: ['BTC-PERPETUAL'] },
{ exchange: 'cryptofacilities', symbols: ['PI_XBTUSD'] },
{ exchange: 'coinbase', symbols: ['BTC-USD'] },
{ exchange: 'binance', symbols: ['ETHBTC'] }
]

// for each specified exchange call streamNormalized for it
// so we have multiple real-time streams for all specified exchanges
const realTimeStreams = exchangesToStream.map(e => {
return streamNormalized(e, normalizeBookChanges)
})

// combine all real-time message streams into one
const messages = combine(...realTimeStreams)

// create book snapshots with depth1 that are produced
// every time best bid/ask info is changed
// effectively computing real-time quotes
const realTimeQuoteComputable = computeBookSnapshots({
depth: 1,
interval: 0,
name: 'realtime_quote'
})

// compute real-time quotes for combines real-time messages
const messagesWithQuotes = compute(messages, realTimeQuoteComputable)

const spreads = {}

// print spreads info every 100ms
setInterval(() => {
console.clear()
console.log(spreads)
}, 100)

// update spreads info real-time
for await (const message of messagesWithQuotes) {
if (message.type === 'book_snapshot') {
spreads[message.exchange] = {
  spread: message.asks[0].price - message.bids[0].price,
  bestBid: message.bids[0],
  bestAsk: message.asks[0]
}
}
}
}

processMessages();