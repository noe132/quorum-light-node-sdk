import { IObject } from './object';

export interface IEncryptedContent {
  Data: string
  Expired: number
  GroupId: string
  SenderPubkey: string
  SenderSign: string
  TimeStamp: String
  TrxId: string
  Version: string
}

export interface IContent {
  Data: IObject
  Expired: number
  GroupId: string
  SenderPubkey: string
  SenderSign: string
  TimeStamp: String
  TrxId: string
  Version: string
}

export interface IListContentsOptions {
  groupId: string;
  count?: number;
  startTrx?: string
  reverse?: boolean
}