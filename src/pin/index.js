import { createAddAll } from './add-all.js'
import { createAdd } from './add.js'
import { createLs } from './ls.js'
import { createRmAll } from './rm-all.js'
import { createRm } from './rm.js'
import { createRemote } from './remote/index.js'

/**
 * @param {import('../types').Options} options
 */
export function createPin (options) {
  return {
    addAll: createAddAll(options),
    add: createAdd(options),
    ls: createLs(options),
    rmAll: createRmAll(options),
    rm: createRm(options),
    remote: createRemote(options)
  }
}
