import { makeAutoObservable } from 'mobx';

export function createStore<T extends object>(store: T): T {
  return makeAutoObservable(store);
}
