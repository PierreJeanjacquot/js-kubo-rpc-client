/* eslint-env browser */
import { Client } from './core.js'
import type { ConfigureFn, ConfigureFactory, Options } from '../types'

/**
 * Set default configuration and call create function with them
 */
export const configure = (fn: ConfigureFn<any>): ConfigureFactory<any> => {
  return (options: Options) => {
    return fn(new Client(options), options)
  }
}
