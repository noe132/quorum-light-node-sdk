const QuorumLightNodeSDK = require('../../dist');

// add group
(async () => {
  try {
    const seedUrl = 'rum://seed?v=1&e=0&n=0&b=Ptpg6HKIRIaTnVw_f3SKvg&c=wPOoSSDCxbk7owipIwJ4nKmRyyN2wRsW1I_vsxZm1dI&g=gTaSO4IDTgi_51DrO1WOLA&k=Aqa6ngNxgrVhf2kQc4nA-0Wr4tsWiaBrshZJPujT5B9g&s=GDLJ-TcXuo95q-CsUFty7pvMIYZRFRQ3VwrparvjKy00wIYSmx5pl4xT4ALb6AVgNei_is5kn1MuXfh9b5wB-QE&t=Fv89llMDYIA&a=%E8%81%8A%E5%A4%A9%E5%AE%A45&y=group_timeline&u=http://103.61.39.166:9003';
    const result = QuorumLightNodeSDK.cache.Group.add(seedUrl, {
      nodeToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd0dyb3VwcyI6W10sImV4cCI6MTY1OTcwNDI2NCwibmFtZSI6Im5vZGUtYWxsLWdyb3VwcyIsInJvbGUiOiJjaGFpbiJ9.mHeMhunwDGmjnB7PhoKqVrUZI7QbfaGxOPgH2o4WUQo'
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
})();

// get group
(async () => {
  try {
    const groupId = '8136923b-8203-4e08-bfe7-50eb3b558e2c';
    const result = QuorumLightNodeSDK.cache.Group.get(groupId);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
})();

// create trx
(async () => {
  try {
    const wallet = QuorumLightNodeSDK.ethers.Wallet.createRandom();
    const result = await QuorumLightNodeSDK.chain.Trx.create({
      groupId: '8136923b-8203-4e08-bfe7-50eb3b558e2c',
      object: {
        type: 'Note',
        content: 'send from NodeJS SDK',
      },
      privateKey: wallet.privateKey,
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
})();

// list contents
(async () => {
  try {
    const result = await QuorumLightNodeSDK.chain.Content.list({
      groupId: '8136923b-8203-4e08-bfe7-50eb3b558e2c',
      count: 100
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
})();
