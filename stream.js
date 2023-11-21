
const { replay } = require('tardis-dev')

async function processMessages() {
  
  const messages = replay({
    exchange: 'bitmex',
    filters: [
      { channel: 'trade', symbols: ['BTCUSD'] },
      { channel: 'orderBookL2', symbols: ['BTCUSD'] }
    ],
    from: '2023-11-05',
    to: '2023-11-06',
    apiKey: 'TD.ihqPR7ggqdD-9pr1.BUSOetaxJ7XYe7O.SSzbiH9KgWteJIn.GqRxaXhpenVxb0t.6l-z3ud6YtTHyWD.inN6'
  })

  for await (const message of messages) {
    console.log(message);
  }
}

processMessages();