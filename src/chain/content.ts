import { IContent, IEncryptedContent, IListContentsOptions } from './types';
import { IObject, AEScrypto, protobuf } from '../utils';
import axios, { AxiosResponse } from 'axios';
import * as Base64 from 'js-base64';
import { assert, error } from '../utils/assert';
import * as cache from '../cache';

export const list = async (options: IListContentsOptions) => {
  const { groupId  } = options;
  const group = cache.Group.get(groupId);
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
  }
  const getGroupCtnItemJsonString = JSON.stringify(getGroupCtnItem);
  const plaintextEncoded = new TextEncoder().encode(getGroupCtnItemJsonString);
  const encrypted = await AEScrypto.encrypt(plaintextEncoded, group!.cipherKey);

  const sendJson = {
    Req: Base64.fromUint8Array(new Uint8Array(encrypted))
  }

  const apiURL = new URL(group!.chainAPIs[0]);
  const res = await (axios.post(`${apiURL.origin}/api/v1/node/groupctn/${groupId}`, sendJson, {
    headers: {
      Authorization: `Bearer ${apiURL.searchParams.get('jwt') || ''}`,
    }
  }) as Promise<AxiosResponse<IEncryptedContent[]>>);
  
  const contents = await Promise.all(res.data.map(async (item) => {
    const data = item.Data;
    const encryptedBuffer = Base64.toUint8Array(data);
    const buffer = await AEScrypto.decrypt(encryptedBuffer, group!.cipherKey);
    let object = protobuf.toObject({
      type: 'quorum.pb._Object',
      buffer
    });
    if (object.image) {
      object.image = object.image.map((item: any) => {
        item.content = Base64.fromUint8Array(item.content);
        return item;
      })
    }
    if (Object.keys(object).join('') === 'type') {
      object = protobuf.toObject({
        type: 'quorum.pb.Person',
        buffer
      });
      if (object.image && object.image.content) {
        object.image.content = Base64.fromUint8Array(object.image.content);
      }
    }
    return {
      ...item,
      Data: object as IObject
    } as IContent;
  }));

  return contents;
}

