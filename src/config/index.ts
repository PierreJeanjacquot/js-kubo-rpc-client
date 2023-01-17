import { createProfiles } from './profiles/index.js'
import { createGet } from './get.js'
import { createGetAll } from './get-all.js'
import { createReplace } from './replace.js'
import { createSet } from './set.js'
import type { Options } from '../types.js'

export function createConfig (options: Options) {
  return {
    getAll: createGetAll(options),
    get: createGet(options),
    set: createSet(options),
    replace: createReplace(options),
    profiles: createProfiles(options)
  }
}
