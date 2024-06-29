import { Socket } from 'net'
const client = new Socket();
const port = 7070;
const host = '127.0.0.1';

client.connect(port, host, function() {
    console.log('Connected');
    const address = client.address()
    if ('address' in address) 
        client.write("Hello From Client " + address.address);
});

client.on('data', function(data) {
    console.log('Server Says : ' + data);
});

client.on('close', function() {
    console.log('Connection closed');
});
