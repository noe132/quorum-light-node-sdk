import * as TrxApi from '../../src/api/trx';

describe('trx api', () => {
  it('getTrx', async () => {
    const groupId = '1d3996d4-943d-421d-898d-59df3dc64984';
    const trxId = '65697a06-a919-4f3e-baae-138392db53b5';
    const ret = await TrxApi.get(groupId, trxId);
    expect(ret.data.GroupId).toBe(groupId);
    expect(ret.data.TrxId).toBe(trxId);
  });
});
