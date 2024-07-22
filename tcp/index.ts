import express from "express";
// import {  } from "express"
import { createTCPServer } from "./server";
import { Server, Socket } from 'net'
import * as WebSocket from "ws"
import cors from "cors"

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors())
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

  const websocketServer = new WebSocket.Server({
  noServer: true,
})

const sockets: Socket[]  = []; // connected ESP's
let tcpServer: Server

// Stop server endpoint
app.get('/api/stop-server', (req, res) => {
  if (tcpServer) {
    tcpServer.close()
    res.sendStatus(200); // Or send relevant response
    return;
  }
  res.sendStatus(401); 
});




server.on("upgrade", (request, socket, head) => {
  websocketServer.handleUpgrade(request, socket, head, (websocket) => {
    websocketServer.emit("connection", websocket, request)
  })
})

websocketServer.on('connection', (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {
    try {
      const json = JSON.parse(message)
      console.log(json.label, json.ip, json.port)
      if (json.label == "SEND TO") {
        const ip = json.ip
        const port = json.port
        const table = json.table
        const period = json.period
        const table_uint8 = new Uint8Array(501)
        table.forEach((b: number, index: number) => table_uint8[index] = Math.round(b)+128);
        table_uint8[500] = Math.round(period*10) + 128;
        console.log(Math.round(period*10)+128)
        sockets.forEach(socket => {
          console.log(socket.remoteAddress, socket.localAddress, socket.remotePort, socket.localPort)
          if (socket.remoteAddress == ip && socket.remotePort == port) {
            socket.write(table_uint8)
            // socket.write("000")
          }
        })
      }
    } catch(err) {}
  });

}); 

app.get('/api/start-server', (req, res) => {
  tcpServer = createTCPServer();
    
  tcpServer.on('connection', function(sock) {
    // sock.write("000")
    websocketServer.clients.forEach((client) => {
      client.send(JSON.stringify({
        label: "CONNECTION",
        data: {
          ip: sock.remoteAddress,
          port: sock.remotePort
        }
      }))
    })
    sockets.push(sock);
  
    sock.on('data', function(data) {
        websocketServer.clients.forEach((client) => {
          client.send(`DATA FROM ${sock.remoteAddress}: ${data}`)
        })
        // Write the data back to all the connected, the client will receive it as data from the server
        // sockets.forEach(function(sock, index, array) {
            // sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
        // });
    });

    sock.on('close', function(data) {
      websocketServer.clients.forEach((client) => {
        client.send(JSON.stringify({
          label: "DISCONNECT",
          data: sock.remoteAddress
        }))
      })
      let index = sockets.findIndex(function(o) {
          return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
      })
      if (index !== -1) sockets.splice(index, 1);
    });
  });

  res.sendStatus(200); // Or send relevant response
});


