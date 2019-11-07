import got from 'got'
import { Filter } from '../types'
import { RealTimeFeedBase } from './realtimefeed'

export class BitstampRealTimeFeed extends RealTimeFeedBase {
  protected wssURL = 'wss://ws.bitstamp.net'
  protected httpURL = 'https://www.bitstamp.net/api/v2'

  protected mapToSubscribeMessages(filters: Filter<string>[]): string | any[] {
    return filters
      .map(filter => {
        if (!filter.symbols || filter.symbols.length === 0) {
          throw new Error('BitstampRealTimeFeed requires explicitly specified symbols when subscribing to live feed')
        }

        return filter.symbols.map(symbol => {
          return {
            event: 'bts:subscribe',
            data: {
              channel: `${filter.channel}_${symbol}`
            }
          }
        })
      })
      .flatMap(c => c)
  }

  protected messageIsError(message: any): boolean {
    return message.channel === undefined
  }

  protected async provideManualSnapshots(filters: Filter<string>[], snapshotsBuffer: any[], shouldCancel: () => boolean) {
    const orderBookFilter = filters.find(f => f.channel === 'diff_order_book')
    if (!orderBookFilter) {
      return
    }

    // does not work currently on node v12 due to https://github.com/nodejs/node/issues/27711
    console.warn(`Due to Node 12 updated http parser and not spec compliant headers being returned by Bitstamp,
       book snapshots do not work currently for Bitstamp real-time stream.
       As a workaround try running node with -http-parser=legacy flag`)

    for (let symbol of orderBookFilter.symbols!) {
      if (shouldCancel()) {
        return
      }

      this.debug('requesting manual snapshot for: %s', symbol)

      const depthSnapshotResponse = await got.get(`${this.httpURL}/order_book/${symbol}?group=1`).json()

      const snapshot = {
        data: depthSnapshotResponse,
        event: 'snapshot',
        channel: `diff_order_book_${symbol}`,
        generated: true
      }
      this.debug('requested manual snapshot for: %s successfully', symbol)

      snapshotsBuffer.push(snapshot)
    }
  }
}