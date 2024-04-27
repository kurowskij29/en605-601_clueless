// serverside

const express = require('express');
const socketio = require('socket.io');
const path = require('path');


const app = express();

app.get('/', (req, res) => {
    res.send('Hi from Codedamn')
});

app.get('/', (req, res) => {
   res.sendFile(path.resolve(__dirname, 'index.html'));
});

const server = app.listen(1337, () => {
    console.log('Server running!')
});

const io = socketio(server)

// io.on('connection', (socket) => {
//     console.log('New connection')
// })

io.on('connection', (socket) => {
   console.log(`New connection: ${socket.id}`);
})
