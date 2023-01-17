import type { Options } from '../types.js'
import { createCp } from './cp.js'
import { createFlush } from './flush.js'
import { createLs } from './ls.js'
import { createMkdir } from './mkdir.js'
import { createMv } from './mv.js'
import { createRead } from './read.js'
import { createRm } from './rm.js'
import { createStat } from './stat.js'
import { createWrite } from './write.js'

export function createFiles (options: Options) {
  return {
    cp: createCp(options),
    flush: createFlush(options),
    ls: createLs(options),
    mkdir: createMkdir(options),
    mv: createMv(options),
    read: createRead(options),
    rm: createRm(options),
    stat: createStat(options),
    write: createWrite(options)
  }
}
