export abstract class StorageMechanism {
  protected _storage: Storage;

  public constructor(storage: Storage) {
    this._storage = storage;
  }

  public get length() {
    return this._storage?.length;
  }

  public get(key: string) {
    const value = this._storage?.getItem(key);
    return value;
  }

  public set(key: string, value: string) {
    this._storage?.setItem(key, value);
  }

  public remove(key: string) {
    this._storage?.removeItem(key);
  }

  public clear() {
    this._storage?.clear();
  }

  public key(index: number) {
    const value = this._storage?.key(index);
    return value && value;
  }
}
