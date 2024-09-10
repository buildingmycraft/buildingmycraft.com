const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function(req, res) {
   res.sendFile('index.html', {root: __dirname});
});

server.on('request', app);
server.listen(3000, function() {console.log('Server listening on port 3000!')});

/** Create websocket **/
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server: server });

wss.broadcast = function broadcast(data) {
   wss.clients.forEach(function each(client) {
      client.send(data);
   });
};

wss.on('connection', function connection(ws) {
   const numClients = wss.clients.size;
   console.log(`${numClients} clients connected!`);

   wss.broadcast(`Current visitors: ${numClients}`);

   if (ws.readyState === ws.OPEN) {
      ws.send('Welcome to my server');
   }

   ws.on('close', function close(){
      wss.broadcast(`Current visitors: ${numClients}`);
      console.log('Connection closed!');
   })
});