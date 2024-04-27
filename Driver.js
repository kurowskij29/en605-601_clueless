// This is the driver for the game
const Deck = require('./Deck.js');
const Room = require('./Room.js');
const Player = require('./Player.js');
const Card = require('./cardLogic.js');

// const readline = require("node:readline");

function init(users) {
   var data = {};

   // var users = [
   // {'ID': 1, 'name': 'p1', 'charName': 'Jim'},
   // {'ID': 2, 'name': 'p2', 'charName': 'Pam'},
   // {'ID': 3, 'name': 'p3', 'charName': 'Dwight'},
   // ];

   var userData = [];
   let chars = [ 'Jim', 'Pam', 'Dwight', 'Angela', 'Michael', 'Andy' ];
   for (let i = 0; i < users.length; i++) {
      userData.push({});
      userData[i]['ID'] =  users[i]['id'];
      userData[i]['name'] = users[i]['name'];
      userData[i]['charName'] = chars.pop();
   }


   // Initialize rooms
   var rooms = [
      new Room.Room('Reception', 'images/card_reception.png'),
      new Room.Room('Conference Room', 'images/card_conference.png'),
      new Room.Room('Break Room', 'images/card_break.png'),
      new Room.Room('Annex', 'images/card_annex.png'),
      new Room.Room('Accounting', 'images/card_accounting.png'),
      new Room.Room('Parking lot', 'images/card_parking.png'),
      new Room.Room('Warehouse', 'images/card_warehouse.png'),
      new Room.Room('Kitchen', 'images/card_kitchen.png'),
      new Room.Room('Michaels Office', 'images/card_office.png'),
   ]

   roomLinks(rooms);

   var startRooms = {};
   startRooms['Jim'] = rooms[7].left;
   startRooms['Pam'] = rooms[3].down;
   startRooms['Dwight'] = rooms[2].down;
   startRooms['Angela'] = rooms[1].right;
   startRooms['Michael'] = rooms[8].left;
   startRooms['Andy'] = rooms[0].down;



   // Initialize cards
   // six characters
   var character_cards = new Deck.Deck([
      new Card.Card('character', 'Jim', 'images/card_jim.png'),
      new Card.Card('character', 'Pam', 'images/card_pam.png'),
      new Card.Card('character', 'Dwight', 'images/card_dwight.png'),
      new Card.Card('character', 'Angela', 'images/card_angela.png'),
      new Card.Card('character', 'Michael', 'images/card_michael.png'),
      new Card.Card('character', 'Andy', 'images/card_andy.png')
   ]);

   // six weapons
   var weapon_cards = new Deck.Deck([
      new Card.Card('weapon', 'Dundie Trophy', 'images/card_trophy.png'),
      new Card.Card('weapon', 'Poisoned Pretzel', 'images/card_pretzel.png'),
      new Card.Card('weapon', 'Coffee Mug', 'images/card_mug.png'),
      new Card.Card('weapon', 'Bacon Grill', 'images/card_grill.png'),
      new Card.Card('weapon', 'Dunder Mifflin Paper', 'images/card_paper.png'),
      new Card.Card('weapon', 'Rabid Bat', 'images/card_bat.png')
   ]);

   // nine rooms
   var room_cards = [];
   for (let ir = 0; ir < rooms.length; ir++) {
      room_cards.push(new Card.Card('room', rooms[ir].name, rooms[ir].imgURL ))
   }

   room_cards = new Deck.Deck(room_cards);


   secretFolder = pickCrime(character_cards, weapon_cards, room_cards);

   var allCards = Deck.mergeDecks([character_cards, weapon_cards, room_cards]);

   // Initialize players
   var players = [];

   var nextPlayer;
   var startRoom;
   for (let ip = userData.length - 1; ip >= 0 ; ip--) {
      startRoom = startRooms[userData[ip].charName];
      if (ip == userData.length - 1) {
         nextPlayer = null;
      }
      else {
         nextPlayer = players[ip+1];
      }
      players[ip] = new Player.Player(userData[ip].ID, userData[ip].name, userData[ip].charName, startRoom, nextPlayer);

      a = 1;
   }

   // Linked list loops around like play around table
   players[ip = userData.length - 1].next = players[0];



   // Deal cards
   let hands = allCards.dealAll(players.length);

   // assign hands to players
   for (let ip = 0; ip < players.length; ip++) {
      players[ip].cardList = hands[ip];
   } 


   var gameOver = false;
   var activePlayer = players[0];

   startTurn(activePlayer);

   data['players'] = players;
   data['activePlayer'] = activePlayer;
   data['rooms'] = rooms;
   data['secret'] = secretFolder;

   return data;

}


function makeSuggestion(player, suspect, weapon, accusation = false, room = player.room) {
   // if (!accusation && room != player.room) {
   //    error("")
   // }
   if (accusation) {
      player.active = false;
      player.myTurn = false;
   }


   let suggestion = {
      "suspect": suspect, 
      "weapon": weapon, 
      "room": room
   };
   return suggestion;
} // end makeSuggestion

function checkAccusation(accusation, secret) {
   let result = false;
   if (secret.suspect.name == accusation.suspect && secret.weapon.name == accusation.weapon && secret.room.name == accusation.room) {
      result =  true;
   }

   return result;

} // checkAccusation


function pollSuggestion(activePlayer, suggestion) {
   let match = false;

   let hotSeat = activePlayer.next(); 
   let cardMatches= [];
   while (!match) {
      cardMatches = hotSeat.checkPoll(suggestion);

      if (cardMatches.length > 0) {
         match = true;
      }
      else if (hotSeat.next != null) {
         hotSeat = hotSeat.next;
      }
      else {
         match = true;
      }
   } // end while

   return hotSeat;
} // end pollSuggestion

function pickCrime(ccards, wcards, rcards) {
   return [ccards.dealOne(), wcards.dealOne(), rcards.dealOne(), ];
} // end pickCrime





// get index of string in array that matches target string
function strMatch(str, array) {
   let idx = 0;
   let found = false;
   while (found && idx < array.length) {
      if (array[idx] === str) {
         found = true;
      } 
      else {
         idx++;
      }
   }

   if (!found) {
      idx = -1;
   }

   return idx;
}

// Convert array of objects' given property to an array of that property
function grabProps(array, propChar) {
   let out = [];
   for (i = 0; i < array.length; i++) {
      out[i] = array[i][propChar];
   }

   return out;
}





function move(activePlayer, dir) {
   if (activePlayer.hasMoved || activePlayer.hasSuggested) {
      console.log("You already moved!!!")
   }
   else {
      move = dir;

      if (activePlayer.room[move] != null && !activePlayer.room[move].isfull()) {
         activePlayer.hasMoved = activePlayer.move(move);
      }
      else {
         console.log("You can't go that way!!!")
      }
   } 
}

function suggestion(activePlayer) {
   if (hasSuggested) {
      console.log("You already suggested!!!")
   }
   else {
      suspect = rl.question("Enter suspect\n", function (string) {
         return string;
      });

      weapon = rl.question("Enter weapon\n", function (string) {
         return string;
      });

      suggestion = makeSuggestion(activePlayer, suspect, weapon, activePlayer.room);

      pollSuggestion(suggestion);

      hasSuggested = true;
   }
}

function accusation(activePlayer) {
   suspect = rl.question("Enter suspect\n", function (string) {
      return string;
   });

   weapon = rl.question("Enter weapon\n", function (string) {
      return string;
   });

   room = rl.question("Enter room\n", function (string) {
      return string;
   });

   accusation = makeSuggestion(activePlayer, suspect, weapon, room, true);

   if (checkAccusation(accusation, secretFolder)) {
      gameOver = true;
      winner = activePlayer;
   }

}

function endTurn(activePlayer) {
   activePlayer.myTurn = false;

   activePlayer.dropped = false; // reset dropped property 

   activePlayer = activePlayer.next;

   return activePlayer;
}

function startTurn(activePlayer) {
   // console.log(activePlayer.name + " it's your turn!!!");

   activePlayer.myTurn = true;
   activePlayer.hasMoved = false;
   activePlayer.hasSuggested = false;
}





function roomLinks(roomArray) {

   hwURL = "99";
/*
      0  1  2
      3  4  5
      6  7  8 
   */
   // room 0 
   roomArray[0].right = new Room.Room('hallway', hwURL, 1);
   roomArray[0].right.right = roomArray[1];
   roomArray[0].right.left = roomArray[0];
   roomArray[0].down = new Room.Room('hallway', hwURL, 1);
   roomArray[0].down.down = roomArray[3];
   roomArray[0].down.up = roomArray[0];
   roomArray[0].passage = roomArray[8];
   // room 1 
   roomArray[1].right = new Room.Room('hallway', hwURL, 1);
   roomArray[1].right.right = roomArray[2];
   roomArray[1].right.left = roomArray[1];
   roomArray[1].left = new Room.Room('hallway', hwURL, 1);
   roomArray[1].left.left = roomArray[0];
   roomArray[1].left.right = roomArray[1];
   roomArray[1].down = new Room.Room('hallway', hwURL, 1);
   roomArray[1].down.down = roomArray[4];
   roomArray[1].down.up = roomArray[1];
   // room 2 
   roomArray[2].left = new Room.Room('hallway', hwURL, 1);
   roomArray[2].left.left = roomArray[1];
   roomArray[2].left.right = roomArray[2];
   roomArray[2].down = new Room.Room('hallway', hwURL, 1);
   roomArray[2].down.down = roomArray[5];
   roomArray[2].down.up = roomArray[2];
   roomArray[2].passage = roomArray[6];
   // room 3 
   roomArray[3].right = new Room.Room('hallway', hwURL, 1);
   roomArray[3].right.right = roomArray[4];
   roomArray[3].right.left = roomArray[3];
   roomArray[3].up = new Room.Room('hallway', hwURL, 1);
   roomArray[3].up.up = roomArray[0];
   roomArray[3].up.down = roomArray[3];
   roomArray[3].down = new Room.Room('hallway', hwURL, 1);
   roomArray[3].down.down = roomArray[6];
   roomArray[3].down.up = roomArray[3];
   // room 4 
   roomArray[4].right = new Room.Room('hallway', hwURL, 1);
   roomArray[4].right.right = roomArray[5];
   roomArray[4].right.left = roomArray[4];
   roomArray[4].left = new Room.Room('hallway', hwURL, 1);
   roomArray[4].left.left = roomArray[3];
   roomArray[4].left.right = roomArray[4];
   roomArray[4].up = new Room.Room('hallway', hwURL, 1);
   roomArray[4].up.up = roomArray[1];
   roomArray[4].up.down = roomArray[4];
   roomArray[4].down = new Room.Room('hallway', hwURL, 1);
   roomArray[4].down.down = roomArray[7];
   roomArray[4].down.up = roomArray[4];
   // room 5 
   roomArray[5].left = new Room.Room('hallway', hwURL, 1);
   roomArray[5].left.left = roomArray[4];
   roomArray[5].left.right = roomArray[5];
   roomArray[5].up = new Room.Room('hallway', hwURL, 1);
   roomArray[5].up.up = roomArray[2];
   roomArray[5].up.down = roomArray[5];
   roomArray[5].down = new Room.Room('hallway', hwURL, 1);
   roomArray[5].down.down = roomArray[8];
   roomArray[5].down.up = roomArray[5];
   // room 6 
   roomArray[6].right = new Room.Room('hallway', hwURL, 1);
   roomArray[6].right.right = roomArray[7];
   roomArray[6].right.left = roomArray[6];
   roomArray[6].up = new Room.Room('hallway', hwURL, 1);
   roomArray[6].up.up = roomArray[3];
   roomArray[6].up.down = roomArray[6];
   roomArray[6].passage = roomArray[2];
   // room 7 
   roomArray[7].right = new Room.Room('hallway', hwURL, 1);
   roomArray[7].right.right = roomArray[8];
   roomArray[7].right.left = roomArray[7];
   roomArray[7].left = new Room.Room('hallway', hwURL, 1);
   roomArray[7].left.left = roomArray[6];
   roomArray[7].left.right = roomArray[7];
   roomArray[7].up = new Room.Room('hallway', hwURL, 1);
   roomArray[7].up.up = roomArray[4];
   roomArray[7].up.down = roomArray[7];
   // room 8
   roomArray[8].left = new Room.Room('hallway', hwURL, 1);
   roomArray[8].left.left = roomArray[7];
   roomArray[8].left.right = roomArray[8];
   roomArray[8].up = new Room.Room('hallway', hwURL, 1);
   roomArray[8].up.up = roomArray[5];
   roomArray[8].up.down = roomArray[8];
   roomArray[8].passage = roomArray[0];
   
} // end roomLinks


function getInput(str) {

   // create interface for input and output
   const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
   });

   // // create empty user input
   // let userInput = "";

   // // question user to enter name
   // rl.question(str, function (string) {
   // userInput = string;


   const userInput = rl.question(str);


   // close input stream
   rl.close();

   
   // });

   return userInput;
}




module.exports = { init, move , startTurn, endTurn, suggestion, accusation, makeSuggestion, checkAccusation, pollSuggestion};