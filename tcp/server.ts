import { createServer, Socket } from 'net';
const port = 7070;
const host = '192.168.78.195';

export const createTCPServer = () => {
    const server = createServer();
    server.listen(port, host, () => {
        console.log('TCP Server is running on port :: ' + port +'');
    });
    server.on("connection", console.log)
    return server;
}