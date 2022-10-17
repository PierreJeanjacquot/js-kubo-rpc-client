/* eslint-env mocha */

import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { base58btc } from 'multiformats/bases/base58'
import { CID } from 'multiformats/cid'
import { expect } from 'aegir/chai'
import { getDescribe, getIt } from '../utils/mocha.js'
import all from 'it-all'
import * as raw from 'multiformats/codecs/raw'
import { sha512 } from 'multiformats/hashes/sha2'

/**
 * @typedef {import('ipfsd-ctl').Factory} Factory
 */

/**
 * @param {Factory} factory
 * @param {object} options
 */
export function testPut (factory, options) {
  const describe = getDescribe(options)
  const it = getIt(options)

  describe('.block.put', function () {
    /** @type {import('ipfs-core-types').IPFS} */
    let ipfs

    before(async function () {
      ipfs = (await factory.spawn()).api
    })

    after(async function () { return factory.clean() })

    it('should put a buffer, using defaults', async function () {
      const expectedHash = 'QmPv52ekjS75L4JmHpXVeuJ5uX2ecSfSZo88NSyxwA3rAQ'
      const blob = uint8ArrayFromString('blorb')

      const cid = await ipfs.block.put(blob)

      expect(cid.toString()).to.equal(expectedHash)
      expect(cid.bytes).to.equalBytes(base58btc.decode(`z${expectedHash}`))
    })

    it('should put a buffer, using options', async function () {
      const blob = uint8ArrayFromString(`TEST${Math.random()}`)

      const cid = await ipfs.block.put(blob, {
        format: 'raw',
        mhtype: 'sha2-512',
        version: 1,
        pin: true
      })

      expect(cid.version).to.equal(1)
      expect(cid.code).to.equal(raw.code)
      expect(cid.multihash.code).to.equal(sha512.code)

      expect(await all(ipfs.pin.ls({ paths: cid }))).to.have.lengthOf(1)
    })

    it('should put a Block instance', async function () {
      const expectedHash = 'QmPv52ekjS75L4JmHpXVeuJ5uX2ecSfSZo88NSyxwA3rAQ'
      const expectedCID = CID.parse(expectedHash)
      const b = uint8ArrayFromString('blorb')

      const cid = await ipfs.block.put(b)

      expect(cid.multihash.bytes).to.equalBytes(expectedCID.multihash.bytes)
    })
  })
}
