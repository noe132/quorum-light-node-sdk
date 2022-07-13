import * as AEScrypto from './AEScrypto';
import * as AEScryptoNodeJS from './AEScryptoNodeJS';

const _AEScrypto = typeof window === 'undefined' ? AEScryptoNodeJS : AEScrypto;

export default _AEScrypto;
