import type { Options } from '../../types.js'
import { createApply } from './apply.js'

export function createProfiles (options: Options) {
  return {
    apply: createApply(options)
  }
}
