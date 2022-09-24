import axios, { AxiosResponse } from 'axios';
import { ITrx, ICreateObjectPayload, ICreatePersonPayload } from './types';
import { assert, error } from '../utils/assert';
import * as cache from '../cache';
import { signTrx } from '../utils';

export const get = async (groupId: string, trxId: string) => {
  assert(groupId, error.required('groupId'));
  assert(trxId, error.required('trxId'));
  const group = cache.Group.get(groupId);
  assert(group, error.notFound('group'));
  const apiURL = new URL(group!.chainAPIs[0]);
  const res = await (axios.get(`${apiURL.origin}/api/v1/trx/${groupId}/${trxId}`, {
    headers: {
      Authorization: `Bearer ${apiURL.searchParams.get('jwt') || ''}`
    }
  }) as Promise<AxiosResponse<ITrx>>);
  return res.data;
}

export const create = async (p: ICreateObjectPayload) => {
  const group = cache.Group.get(p.groupId);
  assert(group, error.notFound('group'));
  const payload = await signTrx({
    type: '_Object',
    groupId: p.groupId,
    data: p.object,
    privateKey: p.privateKey,
    aesKey: group!.cipherKey
  });
  const apiURL = new URL(group!.chainAPIs[0]);
  const res = await (axios.post(`${apiURL.origin}/api/v1/node/trx/${p.groupId}`, payload, {
    headers: {
      Authorization: `Bearer ${apiURL.searchParams.get('jwt') || ''}`,
    }
  }) as Promise<AxiosResponse<{ trx_id: string }>>);
  return res.data;
}

export const createPerson = async (p: ICreatePersonPayload) => {
  const group = cache.Group.get(p.groupId);
  assert(group, error.notFound('group'));
  const payload = await signTrx({
    type: 'Person',
    groupId: p.groupId,
    data: p.person,
    privateKey: p.privateKey,
    aesKey: group!.cipherKey
  });
  const apiURL = new URL(group!.chainAPIs[0]);
  const res = await (axios.post(`${apiURL.origin}/api/v1/node/trx/${p.groupId}`, payload, {
    headers: {
      Authorization: `Bearer ${apiURL.searchParams.get('jwt') || ''}`,
    }
  }) as Promise<AxiosResponse<{ trx_id: string }>>);
  return res.data;
}