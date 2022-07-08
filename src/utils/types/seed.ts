export interface ISeed {
  GenesisBlock: {
    BlockId: string;
    GroupId: string;
    PrevBlockId: string;
    PreviousHash: null,
    TimeStamp: number,
    ProducerPubKey: string;
    Trxs: null,
    Signature: string;
  },
  GroupName: string;
  ConsensusType: string;
  EncryptionType: string;
  CipherKey: string;
  GroupId: string;
  OwnerPubKey: string;
  Signature: string;
  AppKey: string;
  Timestamp: number,
  Urls: string[]
}