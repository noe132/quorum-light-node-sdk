import { IGroup } from './types';
import restoreSeedFromUrl from '../utils/restoreSeedFromUrl';
import { assert, error } from '../utils/assert';

const _localStorage = (typeof localStorage === "undefined" || localStorage === null) ?
  (() => {
    const nodeLocalStorage = require('node-localstorage');
    return new nodeLocalStorage.LocalStorage('./local_storage_data');
  })() :
  localStorage;

const store = (key: string, data?: any) => {
  if (!data) {
    const value = _localStorage.getItem(key);
    return value ? JSON.parse(value) : ''
  }
  _localStorage.setItem(key, JSON.stringify(data));
}

const STORE_KEY = 'lightNodeGroupMap';
type IMap = Record<string, IGroup>;
export const list = () => {
  return Object.values(store(STORE_KEY) || {}) as IGroup[];
}

export const add = (seedUrl: string, extra: {
  nodeToken: string
}) => {
  const map = (store(STORE_KEY) || {}) as IMap;
  const seed = restoreSeedFromUrl(seedUrl);
  assert(extra, error.required('extra'));
  assert(extra.nodeToken, error.required('extra.nodeToken'));
  assert(seed.Urls.length > 0, error.notFound('chain url'));
  map[seed.GroupId] = {
    groupId: seed.GroupId,
    groupName: seed.GroupName,
    consensusType: seed.ConsensusType,
    encryptionType: seed.EncryptionType,
    cipherKey: seed.CipherKey,
    appKey: seed.AppKey,
    ownerPubKey: seed.OwnerPubKey,
    signature: seed.Signature,
    chainAPIs: seed.Urls,
    nodeToken: extra.nodeToken
  };
  store(STORE_KEY, map);
  return {
    groupId: seed.GroupId
  };
}

export const remove = (groupId: string) => {
  assert(groupId, "groupId is required");
  const map = (store(STORE_KEY) || {}) as IMap;
  delete map[groupId];
  store(STORE_KEY, map);
  return {
    groupId
  };
}

export const get = (groupId: string) => {
  assert(groupId, "groupId is required");
  const map = (store(STORE_KEY) || {}) as IMap;
  return map[groupId] as IGroup | null;
}

export const update = (groupId: string, group: IGroup) => {
  assert(groupId, "groupId is required");
  assert(group, "group is required");
  const map = (store(STORE_KEY) || {}) as IMap;
  map[groupId] = group;
  return {
    groupId
  };
}