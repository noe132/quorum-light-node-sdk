export interface IGroup {
  groupId: string;
  groupName: string;
  consensusType: string;
  encryptionType: string;
  cipherKey: string;
  appKey: string;
  ownerPubKey: string;
  signature: string;
  chainAPIs: string[];
  nodeToken: string;
  lastUpdated?: number,
  highestHeight?: number,
  highestBlockId?: string;
}