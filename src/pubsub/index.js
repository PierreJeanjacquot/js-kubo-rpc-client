import { createLs } from './ls.js'
import { createPeers } from './peers.js'
import { createPublish } from './publish.js'
import { createSubscribe } from './subscribe.js'
import { createUnsubscribe } from './unsubscribe.js'
import { SubscriptionTracker } from './subscription-tracker.js'

/**
 * @param {import('../types').Options} options
 */
export function createPubsub (options) {
  const subscriptionTracker = new SubscriptionTracker()

  return {
    ls: createLs(options),
    peers: createPeers(options),
    publish: createPublish(options),
    subscribe: createSubscribe(options, subscriptionTracker),
    unsubscribe: createUnsubscribe(options, subscriptionTracker)
  }
}
