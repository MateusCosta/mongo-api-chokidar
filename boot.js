
module.exports = function boot() {
    console.log('Connecting to the mongo...');
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Connected to mongo...');
      resolve();
    }, 40000);
  });
};