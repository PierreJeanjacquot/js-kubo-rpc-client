import type { ClientOptions, Message, Options } from '../types.js'
import type { SubscriptionTracker } from './subscription-tracker.js'
import type { EventHandler } from '@libp2p/interfaces/events'

export const createUnsubscribe = (options: Options, subsTracker: SubscriptionTracker) => {
  /**
   * Unsubscribes from a pubsub topic
   *
   * @example
   * ```js
   * const topic = 'fruit-of-the-day'
   * const receiveMsg = (msg) => console.log(msg.toString())
   *
   * await ipfs.pubsub.subscribe(topic, receiveMsg)
   * console.log(`subscribed to ${topic}`)
   *
   * await ipfs.pubsub.unsubscribe(topic, receiveMsg)
   * console.log(`unsubscribed from ${topic}`)
   *
   * // Or removing all listeners:
   *
   * const topic = 'fruit-of-the-day'
   * const receiveMsg = (msg) => console.log(msg.toString())
   * await ipfs.pubsub.subscribe(topic, receiveMsg);
   * // Will unsubscribe ALL handlers for the given topic
   * await ipfs.pubsub.unsubscribe(topic);
   * ```
   */
  async function unsubscribe (topic: string, handler: EventHandler<Message>, options?: ClientOptions): Promise<void> {
    subsTracker.unsubscribe(topic, handler)
  }
  return unsubscribe
}
