import * as ContentApi from '../../src/api/content';

describe('content api', () => {
  it('list contents', async () => {
    const groupId = '1d3996d4-943d-421d-898d-59df3dc64984';
    const ret = await ContentApi.list(groupId);
    console.log({ ret });
  });
});
