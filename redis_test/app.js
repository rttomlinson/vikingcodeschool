const express = require('express');
const app = express();
const server = require('http').createServer(app);
const redis = require('redis');
const io = require('socket.io')(server);

const redisClient = redis.createClient();

redisClient.setnx('count', 0);


io.on('connection', client => {
    console.log('New connection!');
    redisClient.get("count", (err, count) => {
        client.emit('new count', count);
    });
    
    client.on('increment', () => {
        redisClient.incr("count", (err, count) => {
            io.emit('new count', count);

        });
    });

    client.on('decrement', () => {
        redisClient.decr("count", (err, count) => {
            io.emit('new count', count);
        });
    });
});


app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client-dist/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// app.get('/', (req, res) => {
//     redisClient.incr('visitor-count', (err, count) => {
//       res.send(`Visitor Count: ${count}`);
//     });
// });

server.listen(process.env.PORT);