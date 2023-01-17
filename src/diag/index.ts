import type { Options } from '../types.js'
import { createCmds } from './cmds.js'
import { createSys } from './sys.js'

export function createDiag (options: Options) {
  return {
    cmds: createCmds(options),
    sys: createSys(options)
  }
}
