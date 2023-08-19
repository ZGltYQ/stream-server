const SimplePeerServer = require('simple-peer-server');
const http = require('http');
const Turn = require('node-turn');

const turnServer = new Turn({
    debug : (lvl, message) => console.log(lvl, message)
});

turnServer.start();

const server = http.createServer();
new SimplePeerServer(server, true);

server.listen(8081);