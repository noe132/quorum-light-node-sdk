import { ISeed } from './types/seed';
import { uint8ArrayToHex } from './typeTransform';
import formatBase64UUID from './formatBase64UUID';
import * as Base64 from 'js-base64';

export default (url: string) => {
  const isValidUrl = url.startsWith('rum://seed?');
  if (!isValidUrl) {
    throw new Error('invalid url');
  }

  const seed = {
    GenesisBlock: {
      BlockId: '',
      GroupId: '',
      PrevBlockId: '',
      PreviousHash: null,
      TimeStamp: 0,
      ProducerPubKey: '',
      Trxs: null,
      Signature: ''
    },
    GroupName: '',
    ConsensusType: '',
    EncryptionType: '',
    CipherKey: '',
    GroupId: '',
    OwnerPubKey: '',
    Signature: '',
    AppKey: '',
    Timestamp: 0,
    Urls: []
  } as ISeed;

  const searchParams = url.split('?')[1];
  const urlParams = new URLSearchParams(searchParams);

  const pVersion = urlParams.get('v') || '';
  if (pVersion !== '1') {
    throw new Error('nonsupport version');
  }

  seed.GroupName = urlParams.get('a') || '';

  const groupId = formatBase64UUID(urlParams.get('g') || '');
  seed.GenesisBlock.GroupId = groupId;
  seed.GroupId = groupId;

  const blockId = formatBase64UUID(urlParams.get('b') || '');
  seed.GenesisBlock.BlockId = blockId;

  const signature = Base64.fromUint8Array(Base64.toUint8Array(urlParams.get('s') || ''));
  seed.GenesisBlock.Signature = signature;
  seed.Signature = signature;

  seed.GenesisBlock.ProducerPubKey = urlParams.get('k') || '';
  seed.OwnerPubKey = urlParams.get('k') || '';

  const cipher = uint8ArrayToHex(Base64.toUint8Array(urlParams.get('c') || ''));
  seed.CipherKey = cipher;

  seed.AppKey = urlParams.get('y') || '';

  seed.ConsensusType = urlParams.get('n') === '1' ? 'pos' : 'poa';

  seed.EncryptionType = urlParams.get('e') === '0' ? 'public' : 'private';

  // const base64Timestamp = Base64.toUint8Array(urlParams.get('t') || '');
  // seed.GenesisBlock.TimeStamp = base64Timestamp;

  const pUrl = urlParams.get('u') || '';
  for (const url of pUrl.split('|')) {
    seed.Urls.push(url);
  }

  return seed;
}