import { configure } from './lib/configure.js'
import type { IpfsUtilsHttpClient } from './types.js'

export const createGetEndpointConfig = configure((api: IpfsUtilsHttpClient) => {
  return () => {
    const url = new URL(api.opts.base ?? '')
    return {
      host: url.hostname,
      port: url.port,
      protocol: url.protocol,
      pathname: url.pathname,
      'api-path': url.pathname
    }
  }
})
