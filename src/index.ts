export * from './api';
export * as utils from './utils';

import * as api from './api';
import * as utils from './utils';

import { ethers } from 'ethers';

const exportDefault = {
  api,
  utils,
  ethers
};

export default exportDefault;

(window as any).QuorumLightNodeSDK = exportDefault;
