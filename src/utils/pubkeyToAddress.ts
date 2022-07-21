import * as Base64 from 'js-base64';
import { ethers } from 'ethers';
import { uint8ArrayToHex } from './typeTransform';

export default (base64: string) => {
  const u8s = Base64.toUint8Array(base64);
  const publicKey = uint8ArrayToHex(u8s);
  return ethers.utils.computeAddress(`0x${publicKey}`);
}
