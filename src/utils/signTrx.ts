import { ISignTrxPayload } from './types';
import * as protobuf from './protobuf';
import * as AEScrypto from './AEScrypto';
import * as typeTransform from './typeTransform';
import { v4 as uuidV4 } from 'uuid';
import sha256 from 'crypto-js/sha256';
import encBase64 from 'crypto-js/enc-base64'
import { utils as etherUtils } from 'ethers';
import * as Base64 from 'js-base64';
import { assert, error } from './assert';

let nonce = 1;
export const signTrx = async (payload: ISignTrxPayload) => {
  const { groupId, object, aesKey, privateKey } = payload;
  assert(groupId, error.required('groupId'));
  assert(object, error.required('object'));
  assert(aesKey, error.required('aesKey'));
  assert(privateKey, error.required('privateKey'));
  const objectProtoBuffer = await protobuf.create({
    protoFileName: 'https://static-assets.xue.cn/quorum.proto',
    type: 'quorum._Object',
    payload: object
  })
  const encrypted = await AEScrypto.encrypt(objectProtoBuffer, aesKey);
  const signingKey = new etherUtils.SigningKey(privateKey);
  const senderPubkey = getSenderPubkey(privateKey);
  const now = new Date();
  const trx = {
    TrxId: uuidV4(),
    GroupId: groupId,
    Data: Base64.fromUint8Array(new Uint8Array(encrypted)),
    TimeStamp: now.getTime() * 1000000,
    Version: '1.0.0',
    Expired: now.setSeconds(now.getSeconds() + 30) * 1000000,
    Nonce: nonce++,
    SenderPubkey: senderPubkey,
  } as any;
  const trxWithoutSignProtoBuffer = await protobuf.create({
    protoFileName: 'https://static-assets.xue.cn/quorum.proto',
    type: 'quorum.Trx',
    payload: trx
  });
  const trxWithoutSignProtoBase64 = Base64.fromUint8Array(new Uint8Array(trxWithoutSignProtoBuffer));
  const hash = sha256(encBase64.parse(trxWithoutSignProtoBase64)).toString();
  const digest = typeTransform.hexToUint8Array(hash);
  const signatureObj = signingKey.signDigest(digest);
  const signature = etherUtils.joinSignature(signatureObj).replace('0x', '');
  const signatureBuffer = typeTransform.hexToUint8Array(signature);
  trx.SenderSign = signatureBuffer;
  const trxProtoBuffer = await protobuf.create({
    protoFileName: 'https://static-assets.xue.cn/quorum.proto',
    type: 'quorum.Trx',
    payload: trx
  });
  const trxJsonString = JSON.stringify({
    TrxBytes: Base64.fromUint8Array(new Uint8Array(trxProtoBuffer)),
    JwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  });
  const plaintextEncoded = new TextEncoder().encode(trxJsonString);
  const encryptedTrxJsonStringBuffer = await AEScrypto.encrypt(plaintextEncoded, aesKey);
  const sendTrxJson = {
    TrxItem: Base64.fromUint8Array(new Uint8Array(encryptedTrxJsonStringBuffer))
  };
  return sendTrxJson;
}

export const getSenderPubkey = (privateKey: string) => {
  const signingKey = new etherUtils.SigningKey(privateKey);
  const pubKeyBuffer = typeTransform.hexToUint8Array(signingKey.compressedPublicKey.replace('0x', ''));
  const senderPubkey = Base64.fromUint8Array(pubKeyBuffer, true);
  return senderPubkey;
}