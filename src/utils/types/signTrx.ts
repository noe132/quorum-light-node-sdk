import { IObject } from '../../chain/types/object';
import { IPerson } from '../../chain/types/person';

export interface ISignTrxPayload {
  type: '_Object' | 'Person'
  groupId: string;
  data: IObject | IPerson;
  aesKey: string;
  privateKey?: string;
  publicKey?: string
  sign?: (hash: string) => string | Promise<string>
}