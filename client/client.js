
// let msg = "pre anything";
// var item = document.createElement('li');
// item.textContent = msg;
// messages.appendChild(item);
// window.scrollTo(0, document.body.scrollHeight);

// ES6 import or TypeScript
// import { io } from "socket.io-client";
// CommonJS
// const io = require("socket.io-client");
 // start javascript section
// var socket = io('http://localhost:3000/');
var socket = io();
// const socket = io.connect("http://localhost:3001");

// msg = "post socket";
// var item = document.createElement('li');
// item.textContent = msg;
// messages.appendChild(item);
// window.scrollTo(0, document.body.scrollHeight);
   
var allCards = {
   "rooms" : ['Reception', 'ConferenceRoom', 'BreakRoom', 'Annex', 'Accounting', 'ParkingLot', 'Warehouse', 'Kitchen', 'MichaelsOffice'],
   "suspects" : ['Jim', 'Pam', 'Dwight', 'Angela', 'Michael', 'Andy',],
   "weapons" : ['DundieTrophy', 'PoisonedPretzel', 'CoffeeMug', 'BaconGrill', 'DunderMifflinPaper', 'RabidBat',],
}

var suspectSel = document.getElementById("suspectSel");
// suspectSel.options = allCards.suspects;
for (let i=0; i < allCards.suspects.length; i++) {
   suspectSel.options[suspectSel.options.length] = new Option(allCards.suspects[i], allCards.suspects[i]);
}
var weaponSel = document.getElementById("weaponSel");
for (let i=0; i < allCards.weapons.length; i++) {
   weaponSel.options[weaponSel.options.length] = new Option(allCards.weapons[i], allCards.weapons[i]);
}


var roomSel = document.getElementById("roomSel");
for (let i=0; i < allCards.rooms.length; i++) {
   roomSel.options[roomSel.options.length] = new Option(allCards.rooms[i], allCards.rooms[i]);
}
roomSel.style.display = "none";



var showSel = document.getElementById("showSel");


 // !!!!!!!!!!!!!!!!!!
 // START input
 // !!!!!!!!!!!!!!!!!!

//  // this is for text based input
//  var form = document.getElementById('form');
//  var input = document.getElementById('input');

//  form.addEventListener('submit', function(e) {
//  e.preventDefault();
//  if (input.value) {
//     socket.emit('action', input.value);
//     input.value = '';
//  }
//  }); // end text based input

 //  this receives the message to send (which will go to all users)
 var messages = document.getElementById('messages');
 socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
 });
 // !!!!!!!!!!!!!!!!!!!!!
 // END chatting
 // !!!!!!!!!!!!!!!!!!!1

 // !!!!!!!!!!!!!!!!!!!!!
 // START usernames
 // !!!!!!!!!!!!!!!!!!!1
 var nameform = document.getElementById('nameform');
 var nameIn = document.getElementById('nameIn');

 // this will submit the username via emit to server (from 1 user)
 nameform.addEventListener('submit', function(e) {
 e.preventDefault();
 if (nameIn.value) {
    socket.emit('username', nameIn.value);
    nameIn.value = '';
    document.getElementById("userbutton").disabled = true;
    nameform.style.display = "none";
   //  toggleSuggestForm();

 }
 });


 // !!!!!!!!!!!!!!!!!!!!!
 // END usernames
 // !!!!!!!!!!!!!!!!!!!1


 // startgame
 var startButton = document.getElementById("start")
 startButton.addEventListener("click", function() { 
    
   socket.emit('go');
 }); 

 socket.on('startOff', () => {
   startButton.style.display = "none";
 });

 // showCard
var subShow = document.getElementById("showForm")
subShow.addEventListener('submit', function(e) {
   e.preventDefault();
   // let showSelectn = document.getElementById('card2show');
   if (showSel.value) {
      socket.emit('showCard', showSel.value);
      // showSelectn.value = '';
      var i, L = showSel.options.length - 1;
      for(i = L; i >= 0; i--) {
         showSel.remove(i);
      }
      togglePopup();
   }
});


// suggestion button
var sugForm = document.getElementById('sugForm')
var suggestionButton = document.getElementById('suggestion')
suggestionButton.addEventListener('click', function() {   
   toggleSuggestForm();
});
// //accusation button
var accusationButton = document.getElementById('accusation')
accusationButton.addEventListener('click', function() {  
   roomSel.style.display = "block"; 
   toggleSuggestForm();
});

// suggestion/accusation form
sugForm.addEventListener('submit', function(e) {
   e.preventDefault();
   if (roomSel.style.display == "none") {
      if (suspectSel.value && weaponSel.value) {
         let data = {};
         data.suspect = suspectSel.value;
         data.weapon = weaponSel.value;
         socket.emit('makeSuggestion', data);
         toggleSuggestForm();
      }
   }
   else {
      if (suspectSel.value && weaponSel.value && roomSel.value) {
         let data = {};
         data.suspect = suspectSel.value;
         data.weapon = weaponSel.value;
         data.room = roomSel.value;
         socket.emit('makeAccusation', data);
         roomSel.style.display = "none";
         toggleSuggestForm();
      }
   }
});




// //accusation form
// sugForm.addEventListener('submit', function(e) {
//    e.preventDefault();
   
// });


//end button (end turn)
var endButton = document.getElementById("endbutton")
endButton.addEventListener("click", function () {
   socket.emit('endTurn');
});

// up button
var upButton = document.getElementById("up");
upButton.addEventListener("click", function() {
   socket.emit('goUp');
});

//down button 

var downButton = document.getElementById("down")
downButton.addEventListener("click", function () {
   socket.emit('goDown');
});


//right button 

var rightButton = document.getElementById("right") 
rightButton.addEventListener("click", function () {
   socket.emit('goRight');
});

//left button 

var leftButton = document.getElementById("left")
leftButton.addEventListener("click", function () {
   socket.emit('goLeft');
});

//passage button

var passageButton = document.getElementById("passage")
passageButton.addEventListener("click" , function() {
   socket.emit('goPassage');
});



 // endTurn to turn off buttons
socket.on('endTurn', function() {         
   // document.getElementById("chatbutton").disabled = true;
   deactivateButtons(allButtons);
});

 // startTurn to turn on buttons
 socket.on('startTurn', function(buttonList) {  
   // let actbut =    document.getElementById("chatbutton");    
   // actbut.disabled = false;
   let buttonObj = [];
   for (let ib = 0; ib < buttonList.length; ib++){
      buttonObj.push(buttonDict[buttonList[ib]]);
   }
   activateButtons(buttonObj);
 });

 socket.on('poke', (opts) => {
   for (let i=0; i < opts.length; i++) {
      showSel.options[showSel.options.length] = new Option(opts[i].name, opts[i].name);
   }
   // let showLabel = document.getElementById('showLabel');
   // let newLab = "Choose one of the following to show:"
   // for (let i = 0; i < opts.length; i++) {
   //    newLab = newLab + " " + opts[i].name;
   //    if (i < opts.length - 1) {
   //       newLab = newLab + ","
   //    }
   // }
   // showLabel.innerHTML = newLab;
   togglePopup();
 });


socket.on('seeCard', (card) => {
   var item = document.createElement('li');
   let msg = "The card is: " + card;
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})
 
socket.on('endGame', (player, acc) => {
   let msg = 'The murder was ' + acc.suspect + ' with the ' + acc.weapon + ' in the ' + acc.room + '!!!';

   // replace toggle all buttons off

   // replace this with a popup
   var item = document.createElement('li');
   item.textContent = msg;
   messages.appendChild(item);
   window.scrollTo(0, document.body.scrollHeight);

});

socket.on('postMove', (roomName) => {
   if (roomName == 'hallway') {
      deactivateButtons([suggestionButton])
   }
   else {
      activateButtons([suggestionButton]);
   }
   deactivateButtons( [upButton, downButton, leftButton, rightButton, passageButton])
});

socket.on('postSugg', () => {
   deactivateButtons([suggestionButton]);
});

var allButtons = [suggestionButton, accusationButton, endButton, upButton, endButton, downButton, leftButton, rightButton, passageButton];
var buttonDict = {
   "suggestion":suggestionButton, 
   "accusation":accusationButton,
   "up":upButton,
   "down":downButton,
   "left":leftButton,
   "right":rightButton,
   "passage":passageButton,
   "endTurn":endButton
};
deactivateButtons(allButtons);


// ###################
// # START FUNCTIONS #
// ###################
function togglePopup() { 
   const overlay = document.getElementById('popupOverlay'); 
   // overlay.classList.toggle('show');
   if (overlay.style.display === "block") {
      overlay.style.display = "none";
   } else {
      overlay.style.display = "block";
   } 
} 

function toggleSuggestForm() { 
   const suggestPopup = document.getElementById('suggestPopup'); 
   if (suggestPopup.style.display === "block") {
      suggestPopup.style.display = "none";
    } else {
      suggestPopup.style.display = "block";
    } 
} 

function deactivateButtons(buttonList) {
   for (let ib = 0; ib < buttonList.length; ib++){
      buttonList[ib].disabled = true;
      buttonList[ib].style.backgroundColor =  "#ff0000"; 
   }

}

function activateButtons(buttonList) {
   for (let ib = 0; ib < buttonList.length; ib++){
      buttonList[ib].disabled = false;
      buttonList[ib].style.backgroundColor =  "#228B22"; 
   }

}