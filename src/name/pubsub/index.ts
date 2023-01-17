import type { Options } from '../../types.js'
import { createCancel } from './cancel.js'
import { createState } from './state.js'
import { createSubs } from './subs.js'

export function createPubsub (config: Options) {
  return {
    cancel: createCancel(config),
    state: createState(config),
    subs: createSubs(config)
  }
}
