
const tardis = require('tardis-dev')
const { streamNormalized, normalizeTrades, normalizeBookChanges } = tardis

async function processMessages() {
  
  const messages = streamNormalized(
    {
      exchange: 'bitmex',
      symbols: ['ETHUSD']
    },
    normalizeBookChanges
  )

  console.log(JSON.stringify(await messages));

  for await (const message of messages) {
    console.log(message);

    console.log(JSON.stringify(message));


  }
}

processMessages();