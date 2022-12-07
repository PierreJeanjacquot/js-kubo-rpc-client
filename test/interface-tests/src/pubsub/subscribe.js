/* eslint-env mocha */

import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { nanoid } from 'nanoid'
import { getTopic } from './utils.js'
import { expect } from 'aegir/chai'
import { getDescribe, getIt } from '../utils/mocha.js'
import delay from 'delay'
import { isNode } from 'ipfs-utils/src/env.js'
import { ipfsOptionsWebsocketsFilterAll } from '../utils/ipfs-options-websockets-filter-all.js'
import sinon from 'sinon'
import pTimeout from 'p-timeout'
import pRetry from 'p-retry'
import { equals as uint8ArrayEquals } from 'uint8arrays/equals'
import { isPeerId } from '@libp2p/interface-peer-id'

/**
 * @typedef {import('ipfsd-ctl').Factory} Factory
 */

/**
 * @typedef SubscribeMessage
 * @property {string} type
 * @property {import('ipfsd-ctl').Controller["peer"]} from
 * @property {Uint8Array} data
 * @property {bigint} sequenceNumber
 * @property {string} topic
 * @property {Uint8Array} key
 * @property {Uint8Array} signature
 */

const retryOptions = {
  retries: 5
}

/**
 * @param {string} topic
 * @param {import('ipfsd-ctl').Controller["peer"]} peer
 * @param {import('ipfsd-ctl').Controller} daemon
 */
const waitForTopicPeer = (topic, peer, daemon) => {
  return pRetry(async () => {
    const peers = await daemon.api.pubsub.peers(topic)

    if (!peers.map(p => p.toString()).includes(peer.id.toString())) {
      throw new Error(`Could not find peer ${peer.id}`)
    }
  }, retryOptions)
}

/**
 *
 * @param {import('ipfsd-ctl').Controller} publisher
 * @param {string} topic
 * @param {SubscribeMessage} msg
 * @param {Uint8Array} data
 * @returns {void}
 */
const validateSubscriptionMessage = (publisher, topic, msg, data) => {
  expect(uint8ArrayEquals(data, msg.data)).to.be.true()
  expect(msg).to.have.property('sequenceNumber')
  expect(msg.sequenceNumber).to.be.a('bigint')
  expect(msg).to.have.property('topic', topic)
  expect(isPeerId(msg.from)).to.be.true()
  expect(msg.from.toString()).to.equal(publisher.peer.id.toString())
}

/**
 *
 * @param {import('ipfsd-ctl').Controller} subscriber
 * @param {string} topic
 * @param {Parameters<import('ipfsd-ctl').Controller['api']['pubsub']['subscribe']>[2]} [options]
 * @param {number} [totalMessages=1]
 * @returns {() => Promise<SubscribeMessage>}
 */
const getSubscriberFn = (subscriber, topic, options, totalMessages = 1) => () => new Promise((resolve, reject) => {
  const allMessages = []
  subscriber.api.pubsub.subscribe(topic, (msg) => {
    try {
      if (msg.type !== 'signed') {
        throw new Error('Message was unsigned')
      }
      allMessages.push(msg)

      if (totalMessages === 1) {
        return resolve(msg)
      }
      if (allMessages.length === totalMessages) {
        return resolve(allMessages)
      }
    } catch (err) {
      reject(err)
    }
  }, options)
})

/**
 *
 * @param {import('ipfsd-ctl').Controller} publisher
 * @param {import('ipfsd-ctl').Controller} subscriber
 * @param {string} topic
 * @param {Uint8Array} data
 * @returns {() => Promise<void>}
 */
const getPublisherFn = (publisher, subscriber, topic, data) => async () => {
  await waitForTopicPeer(topic, subscriber.peer, publisher)
  await delay(1000) // gossipsub needs this delay https://github.com/libp2p/go-libp2p-pubsub/issues/331
  await publisher.api.pubsub.publish(topic, data)
}

/**
 *
 * @param {ReturnType<typeof getSubscriberFn>} subscriberFn
 * @param {ReturnType<typeof getPublisherFn>} publisherFn
 * @param {number} timeout
 * @returns {Promise<SubscribeMessage> | Promise<SubscribeMessage[]>}
 */
const waitForPubSub = async (publisherFn, subscriberFn, timeout = 200000) => {
  const result = await Promise.all([
    pTimeout(subscriberFn(), timeout, 'subscriber timed out'),
    pTimeout(publisherFn(), timeout, 'publisher timed out')
  ])
  return result[0]
}

// const timeout = 20000
/**
 * @param {Factory} factory
 * @param {object} options
 */
export function testSubscribe (factory, options) {
  const ipfsOptions = ipfsOptionsWebsocketsFilterAll()
  const describe = getDescribe(options)
  const it = getIt(options)

  describe('.pubsub.subscribe', function () {
    this.timeout(80 * 1000)

    /** @type {import('ipfs-core-types').IPFS} */
    let ipfs1
    /** @type {import('ipfsd-ctl').Controller} */
    let daemon1
    /** @type {import('ipfs-core-types').IPFS} */
    let ipfs2
    /** @type {import('ipfsd-ctl').Controller} */
    let daemon2
    /** @type {string} */
    let topic
    /** @type {import('ipfs-core-types/src/root').IDResult} */
    let ipfs1Id
    /** @type {import('ipfs-core-types/src/root').IDResult} */
    let ipfs2Id

    beforeEach(async () => {
      daemon1 = await factory.spawn({ ipfsOptions, test: true, args: ['--enable-pubsub-experiment'] })
      ipfs1 = daemon1.api

      daemon2 = await factory.spawn({ ipfsOptions, test: true, args: ['--enable-pubsub-experiment'] })
      ipfs2 = daemon2.api

      ipfs1Id = await ipfs1.id()
      ipfs2Id = await ipfs2.id()
      await ipfs1.swarm.connect(daemon2.peer.addresses[0])
      await ipfs2.swarm.connect(daemon1.peer.addresses[0])

      const peers = await Promise.all([
        ipfs1.swarm.peers(),
        ipfs2.swarm.peers()
      ])

      expect(peers[0].map((p) => p.peer.toString())).to.include(daemon2.peer.id.toString())
      expect(peers[1].map((p) => p.peer.toString())).to.include(daemon1.peer.id.toString())
      topic = getTopic()
    })

    afterEach(async () => factory.clean())

    describe('single node', () => {
      it('should subscribe to one topic', async () => {
        const data = uint8ArrayFromString('hi')

        const subscriber = getSubscriberFn(daemon1, topic)

        const msg = await waitForPubSub(
          () => daemon1.api.pubsub.publish(topic, data),
          subscriber
        )

        validateSubscriptionMessage(daemon1, topic, msg, data)
      })

      it('should subscribe to one topic with options', async () => {
        const data = uint8ArrayFromString('hi')

        const subscriber = getSubscriberFn(daemon1, topic, {})
        const publisher = () => daemon1.api.pubsub.publish(topic, data, {})

        const msg = await waitForPubSub(
          publisher,
          subscriber
        )

        validateSubscriptionMessage(daemon1, topic, msg, data)
      })

      it('should subscribe to topic multiple times with different handlers', async () => {
        const expectedString = 'hello'
        const data = uint8ArrayFromString(expectedString)
        const subscriberFn1 = getSubscriberFn(daemon1, topic)
        const subscriberFn2 = getSubscriberFn(daemon1, topic)

        const [msg1, msg2] = await waitForPubSub(
          async () => await ipfs1.pubsub.publish(topic, data),
          () => Promise.all([subscriberFn1(), subscriberFn2()])
        )
        validateSubscriptionMessage(daemon1, topic, msg1, data)
        validateSubscriptionMessage(daemon1, topic, msg2, data)
      })

      it('should allow discover option to be passed', async () => {
        const data = uint8ArrayFromString('hi')

        const subscriber = getSubscriberFn(daemon1, topic, { discover: true })

        const msg = await waitForPubSub(
          () => daemon1.api.pubsub.publish(topic, data),
          subscriber
        )

        validateSubscriptionMessage(daemon1, topic, msg, data)
      })
    })

    describe('multiple connected nodes', () => {
      it('should receive messages from a different node with floodsub', async function () {
        if (!isNode) {
          return this.skip()
        }
        const expectedString = 'should receive messages from a different node with floodsub'
        const data = uint8ArrayFromString(expectedString)
        const topic = `floodsub-${nanoid()}`
        const daemon1 = await factory.spawn({
          ipfsOptions: {
            config: {
              Pubsub: {
                Router: 'floodsub'
              }
            }
          }
        })
        const ipfs1 = daemon1.api
        const daemon2 = await factory.spawn({
          ipfsOptions: {
            config: {
              Pubsub: {
                Router: 'floodsub'
              }
            }
          }
        })
        const ipfs2 = daemon2.api
        const ipfs2Id = await ipfs2.id()
        await ipfs1.swarm.connect(ipfs2Id.addresses[0])

        const abort1 = new AbortController()
        const abort2 = new AbortController()
        const subscriber1 = getSubscriberFn(daemon1, topic, { signal: abort1.signal })
        const subscriber2 = getSubscriberFn(daemon2, topic, { signal: abort2.signal })

        const publisher = getPublisherFn(daemon2, daemon1, topic, data)
        const [sub1Msg, sub2Msg] = await waitForPubSub(publisher, () => Promise.all([subscriber1(), subscriber2()]))

        validateSubscriptionMessage(daemon2, topic, sub1Msg, data)
        validateSubscriptionMessage(daemon2, topic, sub2Msg, data)
        abort1.abort()
        abort2.abort()
      })

      it('should receive messages from a different node', async () => {
        const expectedString = 'hello from the other side'
        const data = uint8ArrayFromString(expectedString)

        const subscriber1 = getSubscriberFn(daemon2, topic)
        const publisher1 = getPublisherFn(daemon1, daemon2, topic, data)

        let msg = await waitForPubSub(publisher1, subscriber1)
        validateSubscriptionMessage(daemon1, topic, msg, data)

        const subscriber2 = getSubscriberFn(daemon1, topic)
        const publisher2 = getPublisherFn(daemon2, daemon1, topic, data)

        msg = await waitForPubSub(publisher2, subscriber2)
        validateSubscriptionMessage(daemon2, topic, msg, data)
      })

      it('should round trip a non-utf8 binary buffer', async () => {
        const expectedHex = 'a36161636179656162830103056164a16466666666f4'
        const buffer = uint8ArrayFromString(expectedHex, 'base16')

        const subscriber1 = getSubscriberFn(daemon2, topic)
        const publisher1 = getPublisherFn(daemon1, daemon2, topic, buffer)
        const subscriber2 = getSubscriberFn(daemon1, topic)
        const publisher2 = getPublisherFn(daemon2, daemon1, topic, buffer)

        const sub1Msg = await waitForPubSub(publisher1, subscriber1)
        const sub2Msg = await waitForPubSub(publisher2, subscriber2)

        expect(uint8ArrayToString(sub1Msg.data, 'base16')).to.be.eql(expectedHex)
        expect(sub1Msg.from.toString()).to.eql(ipfs1Id.id.toString())
        validateSubscriptionMessage(daemon1, topic, sub1Msg, buffer)

        expect(uint8ArrayToString(sub2Msg.data, 'base16')).to.be.eql(expectedHex)
        expect(sub2Msg.from.toString()).to.eql(ipfs2Id.id.toString())
        validateSubscriptionMessage(daemon2, topic, sub2Msg, buffer)
      })

      it('should receive multiple messages', async () => {
        const outbox = ['hello', 'world', 'this', 'is', 'pubsub']
        const data = outbox.map((str) => uint8ArrayFromString(str))

        const subscriber1 = getSubscriberFn(daemon2, topic, undefined, data.length)
        const publisherFn = async () => {
          for (let i = 0; i < outbox.length; i++) {
            await daemon1.api.pubsub.publish(topic, data[i])
          }
          return Promise.resolve()
        }

        const sub1Msgs = await waitForPubSub(publisherFn, subscriber1, 30000)

        sub1Msgs.forEach((msg, i) => validateSubscriptionMessage(daemon1, topic, msg, data[i]))
      })

      it('should send/receive 100 messages', async function () {
        this.timeout(2 * 60 * 1000)

        const msgBase = 'msg - '
        const count = 100
        const subscriberFn = getSubscriberFn(daemon1, topic, undefined, count)

        /**
         * @type {number}
         */
        let startTime
        const publisherFn = async () => {
          startTime = startTime ?? new Date().getTime()
          for (let i = 0; i < count; i++) {
            const msgData = uint8ArrayFromString(msgBase + i)
            await ipfs2.pubsub.publish(topic, msgData)
          }
          return Promise.resolve()
        }

        const msgs = await waitForPubSub(publisherFn, subscriberFn)

        const duration = new Date().getTime() - startTime
        const opsPerSec = Math.floor(count / (duration / 1000))

        // eslint-disable-next-line
        console.log(`Send/Receive 100 messages took: ${duration} ms, ${opsPerSec} ops / s`)
        /**
         * Node is slower than browser and webworker because it's all running in the same process.
         */
        expect(opsPerSec).to.be.greaterThanOrEqual(isNode ? 25 : 200)

        msgs.forEach(msg => {
          expect(msg.from).to.eql(ipfs2Id.id)
          expect(uint8ArrayToString(msg.data).startsWith(msgBase)).to.be.true()
        })
      })

      it('should receive messages from a different node on lots of topics', async function () {
        if (!isNode) {
          return this.skip()
        }

        const numTopics = 20
        const expectedStrings = []
        const subscriberFns = []
        const publisherFns = []

        for (let i = 0; i < numTopics; i++) {
          const topic = `pubsub-topic-${i}`

          const expectedString = `hello pubsub ${Math.random().toString(32).slice(2)}`
          expectedStrings.push(expectedString)
          const data = uint8ArrayFromString(expectedString)
          subscriberFns.push(getSubscriberFn(daemon1, topic))
          publisherFns.push(getPublisherFn(daemon2, daemon1, topic, data))
        }
        const msgs = await waitForPubSub(
          () => Promise.all(publisherFns.map(fn => fn())),
          () => Promise.all(subscriberFns.map(fn => fn()))
        )

        for (let i = 0; i < numTopics; i++) {
          expect(uint8ArrayToString(msgs[i].data)).to.equal(expectedStrings[i])
          expect(msgs[i].from).to.eql(ipfs2Id.id)
        }
      })

      it('should unsubscribe multiple handlers', async function () {
        this.timeout(2 * 60 * 1000)

        const topic = `topic-${Math.random()}`

        const handler1 = sinon.stub()
        const handler2 = sinon.stub()

        const subscriberFn = async () => await Promise.all([
          ipfs1.pubsub.subscribe(topic, sinon.stub()),
          ipfs2.pubsub.subscribe(topic, handler1),
          ipfs2.pubsub.subscribe(topic, handler2)
        ])

        expect(handler1).to.have.property('callCount', 0)
        expect(handler2).to.have.property('callCount', 0)

        const publisherFn = async () => await ipfs1.pubsub.publish(topic, uint8ArrayFromString('hello world 1'))
        await waitForPubSub(publisherFn, subscriberFn)

        await delay(1000)

        expect(handler1).to.have.property('callCount', 1)
        expect(handler2).to.have.property('callCount', 1)

        await ipfs2.pubsub.unsubscribe(topic)

        await ipfs1.pubsub.publish(topic, uint8ArrayFromString('hello world 2'))

        await delay(1000)

        expect(handler1).to.have.property('callCount', 1)
        expect(handler2).to.have.property('callCount', 1)
      })

      it('should unsubscribe individual handlers', async function () {
        this.timeout(2 * 60 * 1000)

        const topic = `topic-${Math.random()}`

        const handler1 = sinon.stub()
        const handler2 = sinon.stub()

        const subscriberFn = async () => await Promise.all([
          ipfs1.pubsub.subscribe(topic, sinon.stub()),
          ipfs2.pubsub.subscribe(topic, handler1),
          ipfs2.pubsub.subscribe(topic, handler2)
        ])

        expect(handler1).to.have.property('callCount', 0)
        expect(handler2).to.have.property('callCount', 0)

        const publisherFn = async () => await ipfs1.pubsub.publish(topic, uint8ArrayFromString('hello world 1'))
        await waitForPubSub(publisherFn, subscriberFn)

        await delay(1000)

        expect(handler1).to.have.property('callCount', 1)
        expect(handler2).to.have.property('callCount', 1)

        await ipfs2.pubsub.unsubscribe(topic, handler1)
        await ipfs1.pubsub.publish(topic, uint8ArrayFromString('hello world 2'))

        await delay(1000)

        expect(handler1).to.have.property('callCount', 1)
        expect(handler2).to.have.property('callCount', 2)
      })
    })
  })
}
