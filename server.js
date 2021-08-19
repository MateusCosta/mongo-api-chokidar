const express = require('express');

const routes = require('./routes');

module.exports = function () {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Nothing here...');
  });

  app.use('/', routes);

  return app;
};