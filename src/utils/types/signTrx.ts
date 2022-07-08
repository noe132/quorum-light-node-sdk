import { IObject } from './object';

export interface ISignTrxPayload {
  groupId: string;
  object: IObject;
  aesKey: string;
  privateKey: string;
}