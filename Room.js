// Room object

//NOTE: can I use name val pairs???
class Room{
   constructor(name, imgURL, occupancy = 50, up=null, left=null, right=null, down=null, passage=null, occupants=new Set(), weapons=new Set())  {
      this.name =  name;
      this.imgURL =  imgURL;
		this.up =  up;
		this.left =  left;
		this.right =  right;
		this.down =  down;
		this.passage =  passage;
		this.occupants =  occupants;
      this.weapons =  weapons;
      this.occupancy =  occupancy;
   }

      // Move the character to the requested position
      removePlayer(player){
            this.occupants.delete(player);
      } // end removePlayer

      addPlayer(player){
         this.occupants.add(player);
      } // end addPlayer

      
      // Move the weapon to the requested position
      removeWeapon(weapon){
         this.occupants.delete(weapon);
      } // end removeWeapon

      addWeapon(weapon){
         this.occupants.add(weapon);
      } // end addWeapon

      isfull() {
         if (this.occupants.length > this.occupancy) {
            return true;
         }
         else {
            return false;
         }
      }
      
         


} // end Room

module.exports = { Room };