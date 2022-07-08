const SDK = require('./dist');

(async () => {
  try {
    const res = await SDK.Content.list();
    console.log(res);
  } catch (err) {
    console.log(err);
  }
})();