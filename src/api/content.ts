import { IContent, IEncryptedContent, ICreateContentPayload } from './types';
import { IObject, AEScrypto, protobuf, signTrx } from '../utils';
import axios, { AxiosResponse } from 'axios';
import * as Base64 from 'js-base64';
import { assert, error } from '../utils/assert';
import * as Group from './group';

interface IListOptions {
  groupId: string;
  count?: number;
  startTrx?: string
  reverse?: boolean
}

const HARD_CODE_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const list = async (options: IListOptions) => {
  const { groupId  } = options;
  const group = Group.get(groupId);
  assert(group, error.notFound('group'));
  const params = {
    group_id: groupId,
    reverse: options.reverse ? "true" : "false",
    include_start_trx: "false",
    senders: [],
  } as any;
  if (options.startTrx) {
    params.start_trx = options.startTrx;
  }
  if (options.count) {
    params.num = options.count;
  }
  const getGroupCtnItem = {
    Req: params,
    JwtToken: HARD_CODE_JWT_TOKEN
  }
  const getGroupCtnItemJsonString = JSON.stringify(getGroupCtnItem);
  const plaintextEncoded = new TextEncoder().encode(getGroupCtnItemJsonString);
  const encrypted = await AEScrypto.encrypt(plaintextEncoded, group!.cipherKey);

  const sendJson = {
    Req: Base64.fromUint8Array(new Uint8Array(encrypted))
  }

  const res = await (axios.post(`${group!.chainAPIs[0]}/api/v1/node/groupctn/${groupId}`, sendJson, {
    headers: {
      Authorization: `Bearer ${group!.nodeToken}`,
    }
  }) as Promise<AxiosResponse<IEncryptedContent[]>>);
  
  const contents = await Promise.all(res.data.map(async (item) => {
    const data = item.Data;
    const encryptedBuffer = Base64.toUint8Array(data);
    const buffer = await AEScrypto.decrypt(encryptedBuffer, group!.cipherKey);
    const object = await protobuf.toObject({
      protoFileName: 'https://static-assets.xue.cn/quorum.proto',
      type: 'quorum._Object',
      buffer
    });
    return {
      ...item,
      Data: object as IObject
    } as IContent;
  }));

  return contents;
}

export const create = async (data: ICreateContentPayload) => {
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