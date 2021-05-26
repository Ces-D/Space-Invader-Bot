class CacheNode {
  readonly key: any;
  value: any;
  prev: CacheNode;
  next: CacheNode;

  constructor(key: any, value: any) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

/**
 * LRU Cache
 */
export default class Cache {
  cache: Map<any, any>;
  count: number;
  head: CacheNode;
  tail: CacheNode;
  private MAX_SIZE = 10;
  // private TTL = 20 * 60 * 1000; // 20 mins

  constructor() {
    this.cache = new Map();
    this.count = 0;
    this.head = null;
    this.tail = null;
  }

  set(key: any, value: any) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      this.use(key);
      this.cache.set(key, node);
    } else {
      if (this.count >= this.MAX_SIZE) {
        this.evict();
      }

      this.insert(key, value);
      this.use(key); // may not be needed
    }
  }

  /**
   * @returns value of a given key
   */
  get(key: any) {
    if (!this.cache.has(key)) {
      return false;
    }
    this.use(key);
    return this.cache.get(key);
  }

  /**
   * Uses the cacheNode with the given key and marks it as most recently used
   */
  private use(key: any) {
    const node = this.cache.get(key);
    if (node === this.head) {
      return;
    } else if (node === this.tail) {
      node.prev.next = null;
      this.tail = node.prev;
      node.prev = null;
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    } else {
      if (node.prev) {
        node.prev.next = node.next;
      }
      if (node.next) {
        node.next.prev = node.prev;
      }

      node.next = this.head;
      node.prev = null;
      this.head.prev = node;
      this.head = node;
    }
  }

  /**
   * Removes the least recently used cacheNode
   */
  private evict() {
    const keyToEvict = this.tail ? this.tail.key : null;

    if (!this.tail) {
      return;
    } else if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail.prev.next = null;
      this.tail = this.tail.prev;
    }

    if (keyToEvict) {
      this.count--;
      this.cache.delete(keyToEvict);
    }
  }
  /**
   * Add a new cacheNode into queue
   */
  private insert(key: any, value: any) {
    const node = new CacheNode(key, value);
    this.count++;
    this.cache.set(key, node);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
  }

  static createCache(): Cache {
    return new Cache();
  }
}
