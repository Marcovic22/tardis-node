
const tardis = require('tardis-dev')
const { streamNormalized, normalizeTrades, normalizeBookChanges } = tardis
​
const messages = streamNormalized(
  {
    exchange: 'bitmex',
    symbols: ['XBTUSD', 'ETHUSD']
  },
  normalizeTrades,
  normalizeBookChanges
)
​
for await (const message of messages) {
  console.log(message)
}