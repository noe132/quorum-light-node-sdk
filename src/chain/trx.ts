import axios, { AxiosResponse } from 'axios';
import { ITrx, ICreateTrxPayload } from './types';
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

export const create = async (data: ICreateTrxPayload) => {
  const group = cache.Group.get(data.groupId);
  assert(group, error.notFound('group'));
  const payload = await signTrx({
    groupId: data.groupId,
    object: data.object,
    privateKey: data.privateKey,
    aesKey: group!.cipherKey
  });
  const apiURL = new URL(group!.chainAPIs[0]);
  const res = await (axios.post(`${apiURL.origin}/api/v1/node/trx/${data.groupId}`, payload, {
    headers: {
      Authorization: `Bearer ${apiURL.searchParams.get('jwt') || ''}`,
    }
  }) as Promise<AxiosResponse<{ trx_id: string }>>);
  return res.data;
}