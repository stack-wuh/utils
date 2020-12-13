import packageJSON from '../package.json'
import cacheQuery from './cache-query'

export { cacheQuery }

const utils = {
  version: packageJSON.version
}

utils.cacheQuery = cacheQuery

export default utils