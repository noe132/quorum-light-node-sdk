import { IObject } from './object';
import { IPerson } from './person';

export interface ISignTrxPayload {
  type: '_Object' | 'Person'
  groupId: string;
  data: IObject | IPerson;
  aesKey: string;
  privateKey?: string;
}