import axios, { AxiosResponse } from 'axios';
import { ITrx, ICreateTrxPayload } from './types';
import { assert, error } from '../utils/assert';
import * as Group from './group';
import { signTrx } from '../utils';

export const get = async (groupId: string, trxId: string) => {
  assert(groupId, error.required('groupId'));
  assert(trxId, error.required('trxId'));
  const group = Group.get(groupId);
  assert(group, error.notFound('group'));
  const res = await (axios.get(`${group!.chainAPIs[0]}/api/v1/trx/${groupId}/${trxId}`, {
    headers: {
      Authorization: `Bearer ${group!.nodeToken}`
    }
  }) as Promise<AxiosResponse<ITrx>>);
  return res.data;
}

export const create = async (data: ICreateTrxPayload) => {
  const group = Group.get(data.groupId);
  assert(group, error.notFound('group'));
  const payload = await signTrx({
    groupId: data.groupId,
    object: data.object,
    privateKey: data.privateKey,
    aesKey: group!.cipherKey
  });
  const res = await (axios.post(`${group!.chainAPIs[0]}/api/v1/node/trx/${data.groupId}`, payload, {
    headers: {
      Authorization: `Bearer ${group!.nodeToken}`,
    }
  }) as Promise<AxiosResponse<{ trx_id: string }>>);
  return res.data;
}