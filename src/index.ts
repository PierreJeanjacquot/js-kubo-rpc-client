/* eslint-env browser */

import { Multibases } from 'ipfs-core-utils/multibases'
import { Multicodecs } from 'ipfs-core-utils/multicodecs'
import { Multihashes } from 'ipfs-core-utils/multihashes'
import * as dagPB from '@ipld/dag-pb'
import * as dagCBOR from '@ipld/dag-cbor'
import * as dagJSON from '@ipld/dag-json'
import * as dagJOSE from 'dag-jose'
import { identity } from 'multiformats/hashes/identity'
import { bases, hashes, codecs } from 'multiformats/basics'
import { createBitswap } from './bitswap/index.js'
import { createBlock } from './block/index.js'
import { createBootstrap } from './bootstrap/index.js'
import { createConfig } from './config/index.js'
import { createDag } from './dag/index.js'
import { createDht } from './dht/index.js'
import { createDiag } from './diag/index.js'
import { createFiles } from './files/index.js'
import { createKey } from './key/index.js'
import { createLog } from './log/index.js'
import { createName } from './name/index.js'
import { createObject } from './object/index.js'
import { createPin } from './pin/index.js'
import { createPubsub } from './pubsub/index.js'
import { createRefs } from './refs/index.js'
import { createRepo } from './repo/index.js'
import { createRouting } from './routing/index.js'
import { createStats } from './stats/index.js'
import { createSwarm } from './swarm/index.js'
import { createAdd } from './add.js'
import { createAddAll } from './add-all.js'
import { createCat } from './cat.js'
import { createCommands } from './commands.js'
import { createDns } from './dns.js'
import { createGetEndpointConfig } from './get-endpoint-config.js'
import { createGet } from './get.js'
import { createId } from './id.js'
import { createIsOnline } from './is-online.js'
import { createLs } from './ls.js'
import { createMount } from './mount.js'
import { createPing } from './ping.js'
import { createResolve } from './resolve.js'
import { createStop } from './stop.js'
import { createVersion } from './version.js'
import globSourceImport from 'ipfs-utils/src/files/glob-source.js'
import type { BlockCodec, MultibaseCodec, MultihashHasher, Options } from './types.js'

export function create (options: Options = {}) {
  const id: BlockCodec = {
    name: identity.name,
    code: identity.code,
    encode: (id) => id,
    decode: (id) => id
  }

  const multibaseCodecs: MultibaseCodec[] = Object.values(bases);

  (options.ipld?.bases ?? []).forEach(base => multibaseCodecs.push(base))

  const multibases = new Multibases({
    bases: multibaseCodecs,
    loadBase: options.ipld?.loadBase
  })

  const blockCodecs: BlockCodec[] = Object.values(codecs);

  [dagPB, dagCBOR, dagJSON, dagJOSE, id].concat(options.ipld?.codecs ?? []).forEach(codec => blockCodecs.push(codec))

  const multicodecs = new Multicodecs({
    codecs: blockCodecs,
    loadCodec: options.ipld?.loadCodec
  })

  const multihashHashers: MultihashHasher[] = Object.values(hashes);

  (options.ipld?.hashers ?? []).forEach(hasher => multihashHashers.push(hasher))

  const multihashes = new Multihashes({
    hashers: multihashHashers,
    loadHasher: options.ipld?.loadHasher
  })

  const client = {
    add: createAdd(options),
    addAll: createAddAll(options),
    bitswap: createBitswap(options),
    block: createBlock(options),
    bootstrap: createBootstrap(options),
    cat: createCat(options),
    commands: createCommands(options),
    config: createConfig(options),
    dag: createDag(multicodecs, options),
    dht: createDht(options),
    diag: createDiag(options),
    dns: createDns(options),
    files: createFiles(options),
    get: createGet(options),
    getEndpointConfig: createGetEndpointConfig(options),
    id: createId(options),
    isOnline: createIsOnline(options),
    key: createKey(options),
    log: createLog(options),
    ls: createLs(options),
    mount: createMount(options),
    name: createName(options),
    object: createObject(multicodecs, options),
    pin: createPin(options),
    ping: createPing(options),
    pubsub: createPubsub(options),
    refs: createRefs(options),
    repo: createRepo(options),
    routing: createRouting(options),
    resolve: createResolve(options),
    stats: createStats(options),
    stop: createStop(options),
    swarm: createSwarm(options),
    version: createVersion(options),
    bases: multibases,
    codecs: multicodecs,
    hashers: multihashes
  }

  return client
}

export { CID } from 'multiformats/cid'
export { multiaddr } from '@multiformats/multiaddr'
export { default as urlSource } from 'ipfs-utils/src/files/url-source.js'
export const globSource = globSourceImport
