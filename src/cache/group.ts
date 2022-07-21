import { IGroup } from './types';
import restoreSeedFromUrl from '../utils/restoreSeedFromUrl';
import { assert, error } from '../utils/assert';

const store = (key: string, data?: any) => {
  if (!data) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : ''
  }
  localStorage.setItem(key, JSON.stringify(data));
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
  assert(seed.urls.length > 0, error.notFound('chain url'));
  map[seed.group_id] = {
    groupId: seed.group_id,
    groupName: seed.group_name,
    consensusType: seed.consensus_type,
    encryptionType: seed.encryption_type,
    cipherKey: seed.cipher_key,
    appKey: seed.app_key,
    ownerPubKey: seed.owner_pubkey,
    signature: seed.signature,
    chainAPIs: seed.urls,
    nodeToken: extra.nodeToken
  };
  store(STORE_KEY, map);
  return {
    groupId: seed.group_id
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