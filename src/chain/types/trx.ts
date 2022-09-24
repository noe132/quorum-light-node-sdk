import { IObject } from '../../utils/types/object';
import { IPerson } from '../../utils/types/person';

export interface ITrx {
  TrxId: string;
  Type: string;
  GroupId: string;
  Data: string;
  TimeStamp: string;
  Version: string;
  Expired: string;
  ResendCount: string;
  Nonce: string;
  SenderPubkey: string;
  SenderSign: string;
  StorageType: string;
}

export interface ICreateObjectPayload {
  groupId: string;
  object: IObject;
  aesKey: string;
  privateKey?: string;
}

export interface ICreatePersonPayload {
  groupId: string;
  person: IPerson;
  aesKey: string;
  privateKey?: string;
}