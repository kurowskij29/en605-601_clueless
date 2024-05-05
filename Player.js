// player object

// const { default: App } = require('../client/src/App');
// const { SocketContext } = require('../client/src/components/SocketContext');

class Player {
   constructor(userID, name, charName, startRoom, nextPlayer) {
      this.userID =  userID;
      this.name =  name;
      this.character =  charName;
      this.room =  startRoom;
      this.cardList =  [];      
      this.next =  nextPlayer;
      this.myTurn =  false;
      this.active =  true;
      this.interface =  [];      
      this.dropped =  false;
      this.hasMoved = false;
      this.hasSuggested = false;

      this.room.addPlayer(this);

   }

      // Move the character to the requested position
      move(direction){
         var moved = false;

         switch (direction){
            case  "left" :
               this.room.removePlayer(this)
               this.room.left.addPlayer(this)
               moved = true;
               break; 
            case  "right" :
               this.room.removePlayer(this)
               this.room.right.addPlayer(this)
               moved = true;
               break; 
            case  "up" :
               this.room.removePlayer(this)
               this.room.up.addPlayer(this)
               moved = true;
               break; 
            case  "down" :
               this.room.removePlayer(this)
               this.room.down.addPlayer(this)
               moved = true;
               break; 
            case  "passage" :
               this.room.removePlayer(this)
               this.room.passage.addPlayer(this)
               moved = true;
               break; 
         } // end switch

         // Change room property
         this.room = this.room[direction];

         return moved;
      } // end move

      


      // Like move, but can go anywhere bc of someone’s suggestion
      jump(room) {
         this.room = room;
         this.dropped = true;
      }

      // allow player to decide which card to show if polled successfully
      showCard(cardArray) {
         // show all cards to player and make them select one
         inputStr = "Pick one of the following:\n";

         for (let i = 0; i < cardArray.length; i++) {
            inputStr = inputStr + String(i) + ": " + cardArray[i].name + "\n";
         }

         cardInd = rl.question(inputStr , function (string) {
            return string;
         });

         cardInd = Number(cardInd);

         console.log("Card shown is " + cardArray(cardInd).name);
      } // end showCard

      // checks for matches when polled 
      checkPoll(suggestion) {
         let matches = [];
         
         for (let ic = 0; ic < this.cardList.length; ic++) {
            for (const [key, value] of Object.entries(suggestion)) {
               if (this.cardList[ic].name === value) {
                  matches.push(this.cardList[ic]);
               }
            }
         }

         return matches;
      }

   
      // Sets property that is the object the userID interfaces with
     // setInterface(userID){
         // @peyton
         // connect to server GUI for given player
        // const io = require("socket.io")(3000, {
           // cors: {
              // origin: ['http://localhost:8080']
           // }
        // })
       //  io.on("connection", socket => {
          //  console.log(socket.userID);
        // })
    //  } // end setInterface


    deactivate(buttons) {
      // @peyton
      // turn off all buttons for user
      
      buttons = document.getElementsByTagName("button");
      for (var i = 0; i < buttons.length; i++) {
         buttons[i].disabled = true;
      }
      // document.querySelectorAll('.className button').forEach(elem => {
   //    elem.disabled = true;

       // call this.interface.deactivateAll() method ???
      }




} // end Player


module.exports = { Player };