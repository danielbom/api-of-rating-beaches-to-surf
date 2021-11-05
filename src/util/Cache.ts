import NodeCache from 'node-cache';

class Cache {
  constructor(protected cacheService = new NodeCache()) { }

  public get<T>(key: string): undefined | T {
    return this.cacheService.get(key);
  }

  public set<T>(key: string, value: T, ttl = 3600): boolean {
    return this.cacheService.set(key, value, ttl);
  }

  public clearAllCache(): void {
    return this.cacheService.flushAll();
  }
}

export default new Cache();
