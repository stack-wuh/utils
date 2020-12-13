const KEY_FIELD = `@@`

function cacheQuery (fn, {
  key = KEY_FIELD,
  initialValues = {}
}) {
  const cache = new Map()
  
  if (initialValues) {
    cache.set(Symbol(key), initialValues)
  }

  const update = (key, val) => {
    const origin = cache.has(key) ? cache.get(key) : {}

    cache.set(key, { ...origin, ...val })
  }

  function call (params = {}) {
    update(key, params)
    fn.call(this, cache.get(key))

    this.get = key => cache.get(key)
  }
  call.prototype = new call()
  
  // 查询闭包内部缓存的 Store
  call.get = call.prototype.get

  // 原 Map 方法, 查看Store中是否有对应的 Key
  call.has = key => cache.has(key)

  // 原Map方法, 清空当前Key下全部缓存的值
  call.clear = () => cache.clear()

  // 原Map方法, 清空对应的Key的Map
  call.delete = key => cache.delete(key)

  // 根据Key更新 对应的值
  call.update = update

  // 原Map方法, 查询size
  call.size = cache.size

  // 对象销毁, 用于什么周期的注销阶段, 注销后为空
  call.unmounted = () => {
    call = new Object(null)
    cache.clear()
  }
  
  return call
}


export default cacheQuery