import { createPublish } from './publish.js'
import { createResolve } from './resolve.js'
import { createPubsub } from './pubsub/index.js'
import type { Options } from '../types.js'

export function createName (options: Options) {
  return {
    publish: createPublish(options),
    resolve: createResolve(options),
    pubsub: createPubsub(options)
  }
}
