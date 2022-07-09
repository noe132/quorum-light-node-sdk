import { IObject } from '../../utils/types/object';

export interface IEncryptedContent {
  Data: string
  Expired: number
  GroupId: string
  SenderPubkey: string
  SenderSign: string
  TimeStamp: number
  TrxId: string
  Version: string
}

export interface IContent {
  Data: IObject
  Expired: number
  GroupId: string
  SenderPubkey: string
  SenderSign: string
  TimeStamp: number
  TrxId: string
  Version: string
}
