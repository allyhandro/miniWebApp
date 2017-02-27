// warmUp.js - familiarization with the net module by creating a simple server that responds to http requests

const net = require('net');
const [HOST, PORT] = ['127.0.0.1', 8080];


const server = net.createServer((sock) =>{
    console.log(sock.remoteAddress, sock.remotePort);
    sock.on('data', (binaryData) => {
        console.log(binaryData + ' ');
        sock.write('HTTP/1.1 200 OK\r\n\Content-Type: text/html\r\n\r\n<em>Hello</em><strong>World</strong>');
        sock.end();
    })
});

server.listen(PORT,HOST);
