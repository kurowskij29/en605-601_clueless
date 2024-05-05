const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const lib = require('./library');
const dr = require('./Driver');

app.use(express.static(path.join(__dirname, '/client')));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

var users = [];
var n = 0;
var data;

io.on('connection', (socket) => {
   // initialize a user when they enter
   console.log('a user connected');
   n = n+1;
   var username = 'Player ' + n;
   users.push({
       'name' : username,
       'id' : socket.id,
   });

   // this receives username set
   socket.on('username', (name) => {
      username = name;
      let iu = getUserIndex(socket.id);
      users[iu]['name'] = username;
      io.emit('chat message', username + ' joined the chat!!!');
      console.log(socket.id + ' is: ' + name);
   });

   // this receives a chat message and emits to all users
   // (IT DOESNT get used RN bc chat box is for playing game)
   socket.on('chat message', (msg) => {
      io.emit('chat message', username + ': ' + msg);
   });

   // when someone presses start button
   socket.on('go', () => {
      io.emit('chat message', 'Starting Game!!!');
      let msg = lib.genHello();
      io.emit('chat message', msg);

      data = dr.init(users);

      let cardTxt;
      for (let ip = 0; ip < data.players.length; ip++) {
         cardTxt = "Your cards are:";
         for (let ic = 0; ic < data.players[ip].cardList.length; ic++) {
            cardTxt = cardTxt + " " + data.players[ip].cardList[ic].name;
         } // end loop over cards
         io.to(data.players[ip].userID).emit('chat message', cardTxt);
      } // end loop over players

      msg = data.activePlayer.character + '(' + data.activePlayer.name + ') you are up!!';
      io.emit('chat message', msg);
      io.emit('startOff');

      let buttonList = dr.startTurn(data.activePlayer);
      io.to(data.activePlayer.userID).emit('startTurn', buttonList);
   });

   socket.on('showCard', (card) => {
      io.to(data.activePlayer.userID).emit('seeCard', card);
   });

   socket.on('goUp', () => {
      handleMove('up');
   });
   //socket on for move down
   socket.on('goDown', () => {
      handleMove('down');
   });
   //socket on for move right
   socket.on('goRight' , () => {
      handleMove('right');
   });
   //socket on for move left
   socket.on('goLeft', () => {
      handleMove('left');
   });
   //socket on for passage move
   socket.on('goPassage', () => {
      handleMove('passage'); 
   });

   socket.on('makeAccusation', (dat) => {
      let win;
      win = handleAccusation(dat);
      if (win) {
         io.emit('endGame', data.activePlayer, dat);
      }
      else {
         handleEnd();
      }
   });

   //socket on for suggestion
   socket.on('makeSuggestion', (dat) => {
      let pokee = handleSuggestion(dat);
      let msg;
      if (pokee == null) {
         msg = "Suggestion was not disproven!";
      }
      else {
         msg = pokee.character  + '(' + pokee.name + ') showed a card!'; 
      }
      io.emit('chat message', msg);
      io.to(data.activePlayer.userID).emit('postSugg');
   });

   //socket on end turn
   socket.on('endTurn', () => {
      handleEnd();
   });

      // $$$$$$$$$$$$$$$$$$$$$$$
      // $$$   functions     $$$
      // $$$$$$$$$$$$$$$$$$$$$$$      
      function handleMove(dir) {
         // Create message start
         let msg = data.activePlayer.character + '(' + data.activePlayer.name + ') moved ' + dir + ' from ';

         // Create descriptive message of first room for text based
         let adr = 'hallway';
         if (data.activePlayer.room.name != 'hallway') {
            let ir = 0;
            let found = false;
            while (!found) {
               if (data.rooms[ir].name == data.activePlayer.room.name) {
                  found = true;
               }
               else {ir++}
            }

            adr = data.activePlayer.room.name + '(room #' + ir + ') to ';
         }
         msg = msg + adr;

         // Run move method to update data structures
         dr.move(data.activePlayer, dir);

         // Add new room to message
         msg = msg + ' to ' + data.activePlayer.room.name;
         io.emit('chat message', msg);
         io.to(data.activePlayer.userID).emit('postMove', data.activePlayer.room.name);

      }

      function handleEnd() {
         // Deactivate player button
         io.to(data.activePlayer.userID).emit('endTurn');

         // end turn and pass return value (next player) back
         data.activePlayer = dr.endTurn(data.activePlayer)
         

         // Start active player turn (initialize vars and activate button)
         let buttonList = dr.startTurn(data.activePlayer);
         io.to(data.activePlayer.userID).emit('startTurn', buttonList);

         // Tell next player they're up
         let msg = data.activePlayer.character + '(' + data.activePlayer.name + ') you are up!!';
         io.emit('chat message', msg);
      }

      function handleSuggestion(sug) {

         var suggestion = dr.makeSuggestion(data.activePlayer, sug.suspect, sug.weapon)

         for (let ip = 0; ip < data.players.length; ip++) {
            if (suggestion.suspect == data.players[ip].character) {
               let roomObj = getPropMatchObj(data.rooms, 'name', suggestion.room);
               data.players[ip].jump(roomObj)
               io.emit('chat message', data.players[ip].character + '(' + data.players[ip].name + ') got moved to ' + suggestion.room )
            }
         }

         playerToPoke = dr.pollSuggestion(data.activePlayer, suggestion, data.players.length);
         // io.emit('chat message', 'in suggestion');

         data.activePlayer.hasSuggested = true;

         if (playerToPoke == null) {
            return null;
         }

         var opts = playerToPoke.checkPoll(suggestion);
         
         // io.emit('chat message', 'ab 2 poke');
         // io.to(playerToPoke.userID).emit('chat message', 'im gonna poke you');

         socket.to(playerToPoke.userID).emit('poke', opts);

         

         

         return  playerToPoke;
      }

      function handleAccusation(acc) {         
         var accusation = dr.makeSuggestion(data.activePlayer, acc.suspect, acc.weapon, true, acc.room)
         var isRight = dr.checkAccusation(accusation, data.secret);

         let msg;
         if (isRight) {
            msg = data.activePlayer.character + '(' + data.activePlayer.name + ') won the game!!!!'
         }
         else {
            let iActiv = getUserIndex(data.activePlayer.userID);
            let iLast, iNew;
            if (iActiv == 0) {
               iLast = data.players.length-1;
            }
            else {iLast = iActiv - 1;}
            if (iActiv == data.players.length-1) {
               iNew = 0;
            }
            else {iNew = iActiv + 1;}

            data.players[iLast].next = data.players[iNew];
            data.players.splice(iActiv,1);
            msg = data.activePlayer.character + '(' + data.activePlayer.name + ') was wrong - they are out of the game'
         }
         io.emit('chat message', msg);
         return isRight;
      }

     
   


// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$ end io.on(connection) $$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});



function getUserIndex(id) {
   let i = 0;
   let found = false;
   while (!found) {
      if (users[i]['id'] == id) {
         found = true;
      }
      else {
         i++;
      }
   }
   return i;
}

function getPropMatchObj(objArray, propStr, strMatch) {
   let match = null;
   for (let i = 0; i < objArray.length; i++) {
      if (objArray[i][propStr] == strMatch) {
         match = objArray[i];
      }
   }
   return match;
}

