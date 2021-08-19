const path = require('path');
const debug = require('debug')('app');
const chokidar = require('chokidar');

const boot = require('./boot');

const state = {
  server: null,
  sockets: [],
};

function start() {
  state.server = require('./server')().listen(3000, () => {
    debug('Started on 3000');
  });
  state.server.on('connection', (socket) => {
    debug('Add socket', state.sockets.length + 1);
    state.sockets.push(socket);
  });
}

function pathCheck(id) {
  return (
    id.startsWith(path.join(__dirname, 'routes')) ||
    id.startsWith(path.join(__dirname, 'server.js'))
  );
}

function restart() {
  // clean the cache
  Object.keys(require.cache).forEach((id) => {
    if (pathCheck(id)) {
      debug('Reloading', id);
      delete require.cache[id];
    }
  });

  state.sockets.forEach((socket, index) => {
    debug('Destroying socket', index + 1);
    if (socket.destroyed === false) {
      socket.destroy();
    }
  });

  state.sockets = [];

  state.server.close(() => {
    debug('Server is closed');
    debug('\n----------------- restarting -------------');
    start();
  });
}

boot()
  .then(() => {
    start();
    chokidar.watch('./routes').on('all', (event, at) => {
      if (event === 'add') {
        debug('Watching for', at);
      }

      if (event === 'change') {
        debug('Changes at', at);
        restart();
      }
    });
  })
  .catch((err) => {
    debug(err);
  });