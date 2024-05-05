

class Deck {
   constructor(cards) {
      this.count = 0;
      this.allCards = cards;
      this.stack = [];
   };

      shuffle() {
         let pick = -1;
         let max = this.allCards.length - 1;
         let min = 0;

         while (this.allCards.length > 0) {
            pick =  Math.floor(Math.random() * (max - min + 1) ) + min;
            this.stack[this.count] = this.allCards[pick];
            this.allCards.splice(pick,1);
            max = this.allCards.length - 1;
            this.count++;
         }
      }


      dealAll(nPlayer) {
         let hands = [];
         for (let ip = 0; ip < nPlayer; ip++) {
            hands[ip] = [];
         }

         let ip = 0
         let pick;
         while (this.count > 0) {
            if (ip >= nPlayer){
               ip = 0;
            }

            pick = this.stack.pop();
            this.count--;
            hands[ip].push(pick);

            ip++;

         }

         return hands;
      } // end dealAll


      dealOne() {
         let pick = this.stack.pop();
         this.count--;
         return pick
      } // end dealOne









}


function mergeDecks(deckArray){
   let newArray = deckArray[0].stack;

   for (let id = 1; id < deckArray.length; id++) {
      newArray = newArray.concat(deckArray[id].stack);
   }

   let newDeck = new Deck(newArray);
   newDeck.shuffle();
   return newDeck;
} // end mergeDecks

module.exports = { Deck, mergeDecks };