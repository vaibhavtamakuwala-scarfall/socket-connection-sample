const server = require('http').createServer();
const io = require('socket.io')(server);

const getMemoryUsageInMB = (label) => {
    const memoryUsage = process.memoryUsage();
    console.log(`${label} - Memory usage:`);
    console.log(`RSS: ${memoryUsage.rss / 1024 / 1024} MB`);
    console.log(`Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB`);
    console.log(`Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB`);
    console.log(`External: ${memoryUsage.external / 1024 / 1024} MB`);
    return (memoryUsage.rss / 1024 / 1024).toFixed(2); // RSS memory (resident set size) In MB
};

console.log('--------------------START--------------------');
const initialMemoryUsage = getMemoryUsageInMB("initialMemoryUsage");
console.log('initialMemoryUsage: ', initialMemoryUsage);
console.log('---------------------------------------------');

let memoryBeforeConnection;
io.on('connection', client => {
    console.info("---CONNECTION---")
    // Record memory usage when the connection is established
    const afterConnection = getMemoryUsageInMB("AfterConnection");
    console.log('After connection memory usage: ', afterConnection);
    console.log('-----------------------------------------------');

    // Calculate memory used by this connection
    const memoryUsedByConnection = initialMemoryUsage - afterConnection;

    console.log(`Connection from ${client.handshake.address}`);
    console.log(`Memory used during this connection: ${memoryUsedByConnection.toFixed(2)} MB`);
    console.log('--------------------END--------------------');

    client.on('disconnect', () => {
        console.info("---DISCONNECT---")

        const endMemory = getMemoryUsageInMB("Disconnect");
        console.log('Memory on disconnect(MB): ', endMemory);
    });
});
const PORT = 4000;
server.listen(PORT, () => {
    console.info(`Server is listening on ${PORT}`)
});