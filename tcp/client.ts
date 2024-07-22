import { Socket } from 'net'
const client = new Socket();
const port = 7070;
const host = '192.168.13.195';

client.connect(port, host, function() {
    console.log('Connected');
    const address = client.address()
    if ('address' in address) 
        console.log(address.address, address.port)
        // client.write("Hello From Client " + address.address);
});

client.on('data', function(data) {
    const bytes = Uint8Array.from(data)
    console.log('Server Says : ' + bytes);
});

client.on('close', function() {
    console.log('Connection closed');
});
