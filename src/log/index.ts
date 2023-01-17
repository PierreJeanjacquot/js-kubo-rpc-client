import type { Options } from '../types.js'
import { createLevel } from './level.js'
import { createLs } from './ls.js'
import { createTail } from './tail.js'

export function createLog (options: Options) {
  return {
    level: createLevel(options),
    ls: createLs(options),
    tail: createTail(options)
  }
}
