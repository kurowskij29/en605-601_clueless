// client side
<script src="/socket.io/socket.io.js"></script>

socket.on('notification', (data) => {
   console.log(`New notification: ${data}`);
})


const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});



