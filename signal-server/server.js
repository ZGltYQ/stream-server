const SimplePeerServer = require('simple-peer-server');
const http = require('http');

const server = http.createServer();
new SimplePeerServer(server, true, {
    simplePeerOptions: {
        config: {
        iceServers: [
            { urls: 'stun:hisokajenkins.space:5349' }, 
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' }
        ],
    }
}});

server.listen(8081);