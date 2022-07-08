import axios, { AxiosResponse } from 'axios';
import { ITrx } from './types';
import { assert, error } from '../utils/assert';
import * as Group from './group';

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