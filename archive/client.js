

// ES6 import or TypeScript
import { io } from "socket.io-client";
// CommonJS
const io = require("socket.io-client");


 // start javascript section
 var socket = io();
   
 // !!!!!!!!!!!!!!!!!!
 // START input
 // !!!!!!!!!!!!!!!!!!

 // this will submit the chat via emit to server (from 1 user)
 var form = document.getElementById('form');
 var input = document.getElementById('input');

 form.addEventListener('submit', function(e) {
 e.preventDefault();
 if (input.value) {
    socket.emit('action', input.value);
    input.value = '';
 }
 });

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
 }
 });

 // this receives the message to send (which will go to all users)
 socket.on('usernameSet', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
 });
 // !!!!!!!!!!!!!!!!!!!!!
 // END usernames
 // !!!!!!!!!!!!!!!!!!!1


 // startgame
 var startButton = document.getElementById("start")
 startButton.addEventListener("click", function() { 
    socket.emit('go');
 }); 
 // end startgame

 // endTurn to turn off buttons
 socket.on('endTurn', function() {         
    document.getElementById("chatbutton").disabled = true;
 });

 // startTurn to turn on buttons
 socket.on('startTurn', function() {         
    document.getElementById("chatbutton").disabled = false;
 });

 socket.on('poke', function(opts) {
    var item = document.createElement('li');
    let msg = 'You need to show one of the following: ';
    for (let i = 0; i < opts.length; i++) {
       msg = msg + opts[i];
       if (i < opts.length - 1) {
          msg = msg + ', ';
       }
       else {
          msg = msg + '.';
       }
    }
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);




 });
 
 // end javascript section



