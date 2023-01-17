import { AddOptions, createAddAll } from './add-all.js'
import last from 'it-last'
import { configure } from './lib/configure.js'
import { normaliseInput } from 'ipfs-core-utils/files/normalise-input-single'
import type { ImportCandidate } from 'ipfs-core-types/src/utils.js'
import type { AddResult, Options } from './types.js'

export function createAdd (options: Options) {
  const all = createAddAll(options)
  return configure(() => {
    /**
     * Import a file or data into IPFS
     */
    async function add (input: ImportCandidate, options?: AddOptions): Promise<AddResult> {
      const source = normaliseInput(input)
      // // @ts-expect-error - all may return undefined if source is empty
      const addAllPromise = all(source, options)
      // @ts-expect-error - last may return undefined if source is empty
      return await last(addAllPromise)
    }
    return add
  })(options)
}
