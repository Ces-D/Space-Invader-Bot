export default class Cache {
  cache: Map<any, any>;
  private MAX_SIZE = 10
  private TTL = 10

  constructor() {
    this.cache = new Map();
  }

  set(key: any, value: any) {
    return this.cache.set(key, value);
  }

  clear() {
    return this.cache.clear();
  }

  get(key: any) {
    return this.cache.get(key);
  }

  has(key: any) {
    return this.cache.has(key);
  }

  delete(key: any) {
    return this.cache.delete(key);
  }

}

// TODO: check the design patterns book for examples of cache
