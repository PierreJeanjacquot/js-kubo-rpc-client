import { createLs } from './ls.js'
import { createPeers } from './peers.js'
import { createPublish } from './publish.js'
import { createSubscribe } from './subscribe.js'
import { createUnsubscribe } from './unsubscribe.js'
import { SubscriptionTracker } from './subscription-tracker.js'
import type { Options } from '../types.js'

export function createPubsub (options: Options) {
  const subscriptionTracker = new SubscriptionTracker()

  return {
    ls: createLs(options),
    peers: createPeers(options),
    publish: createPublish(options),
    subscribe: createSubscribe(options, subscriptionTracker),
    unsubscribe: createUnsubscribe(options, subscriptionTracker)
  }
}
