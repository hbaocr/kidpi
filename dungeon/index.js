var Util = require('./util.js');
var Room = require('./room.js').Room;
var Armor = require('./armor.js').Armor;
var Dungeon = require('./dungeon.js').Dungeon;
var DungeonCore = require('./dungeon.js').DungeonCore;
var Adventurer = require('./adventurer.js').Adventurer;
var Monster = require('./monster.js').Monster;


var out = console.log;

class Game {
  constructor() {
    this.turn = 1;
    this.player = null;
    this.roleOptions = [
      {name: "Dungeon Core", action: () => { this.buildCore(); }},
      {name: "Adventurer", action: () => { this.buildAdventurer(); }},
      {name: "Help", action: () => { this.roleHelp(); }},
    ];

    this.coreOptions = [
      {name: "Build room", action: () => { this.buildRoom() }},
      {name: "Build trap", action: () => { this.buildTrap() }},
      {name: "Create Monster", action: () => { this.buildMonster() }},
    ];

    this.adventurerOptions = [
      {name: "Inspect", action: () => { this.player.curRoom.describe(); }},
      {name: "Pickup", viable: () => {return this.player.curRoom.hasLoot();}, action: (cb) => { return this.getLoot(cb); }},
      {name: "Cast", viable: () => { return this.player.spells.length > 0; }, action: (cb) => { this.handleSpell(cb); return true; }},
      {name: "Eat", viable: () => { return this.player.food.length > 0; }, action: (cb) => { this.handleFood(cb); return true; }},
      {name: "Go north", viable: () => {return this.player.curRoom.hasNorth();}, action: () => { this.goNorth() }},
      {name: "Go south", viable: () => {return this.player.curRoom.hasSouth();}, action: () => { this.goSouth() }},
      {name: "Go east", viable: () => {return this.player.curRoom.hasEast();}, action: () => { this.goEast() }},
      {name: "Go west", viable: () => {return this.player.curRoom.hasWest();}, action: () => { this.goWest() }},
      {name: "Go Up", viable: () => {return this.player.curRoom.hasUp();}, action: () => { this.goUp() }},
      {name: "Go Down", viable: () => {return this.player.curRoom.hasDown();}, action: () => { this.goDown() }},
      {name: "Loot Chest", viable: () => {return this.player.curRoom.hasChest();}, action: (cb) => { this.player.lootChest(cb); return true; }},
      {name: "Inventory", viable: () => {return this.player.backpack.length > 0;}, action: (cb) => { this.player.inspectBackpack(cb); return true; }},
    ];

    this.itemOptions = [
      {name: "Inspect", action: () => { this.inspectRoom() }},
      {name: "Take", action: () => { this.takeObjects() }},
    ];

    this.adventurerMonsterOptions = [
      {name: "Charge", action: (cb) => { this.handleCharge(cb); return true; }},
      {name: "Cast", viable: () => { return this.player.spells.length > 0; }, action: (cb) => { this.handleSpell(cb); return true; }},
      {name: "Shoot", viable: () => { return this.player.type == "archer"; }, action: () => { this.handleShooting() }},
      /*{name: "Throw", action: () => { this.handleThrow() }},
      {name: "Communicate", action: () => { this.handleCommunication() }},*/
      {name: "Run Away", viable: () => { return this.player.inFight; }, action: (cb) => { this.handleRunAway(cb) }},
    ];

    this.adventurerFightOptions = [
      {name: "Attack", action: (cb) => { this.handleAttack(cb); return true; }},
      {name: "Cast", viable: () => { return this.player.spells.length > 0; }, action: (cb) => { this.handleSpell(cb); return true; }},
      {name: "Run Away", viable: () => { return this.player.inFight; }, action: (cb) => { this.handleRunAway(cb) }},
    ];

    this.dungeon = new Dungeon(this);
  }

  buildCore() {
    this.core = new DungeonCore(this);
    this.core.buildSurvey(() => {
      console.log("You are done building your core!!  Onward!!");
      this.tick();
    });
  }

  buildAdventurer() {
    this.adventurer = new Adventurer(this);
    this.adventurer.buildSurvey(() => {
      console.log("You are done building your Adventurer!!  Onward!!");
      setTimeout(() => {
        console.log('\x1Bc');
        this.tick();
      }, 1000);
    });
  }

  roleHelp() {
    console.log("I see you need help choosing!!!");
    this.tick();
  }

  buildRoom() {
    console.log("I see you would like to build a room!");
  }

  buildTrap() {
    console.log("I see you would like to build a Trap!");
  }

  buildMonster() {
    console.log("I see you would like to build a monster!");
  }

  addManaCheck() {
    if (this.player.type == "wizard") {
      let room = this.player.curRoom;
      if (room.mana > 0) {
        console.log("You have absorbed mana from this room!");
        this.player.mana += room.mana;
        if (this.player.mana > this.player.maxMana) {
          this.player.mana = this.player.maxMana;
        }
        room.mana = 0;
      }
    }
  }

  goNorth() {
    this.player.goNorth();
    this.addManaCheck();
  }

  goSouth() {
    this.player.goSouth();
    this.addManaCheck();
  }

  goEast() {
    this.player.goEast();
    this.addManaCheck();
  }

  goWest() {
    this.player.goWest();
    this.addManaCheck();
  }

  handleCharge(cb) {
    out("You have decided to enage the " + this.player.curRoom.monsters[0].name + " with your " +
        this.player.weapons[0].name);
    this.player.inFight = true;
    this.player.fighting = this.player.curRoom.monsters[0];
    cb();
  }

  handleSpell(cb) {
    this.player.cast(() => {
      cb();
    });
  }

  handleFood(cb) {
    this.player.eat(() => {
      cb();
    });
  }

  handleAttack(cb) {
    this.player.attack(()=>{
      cb();
    });
  }

  handleRunAway(cb) {
    this.player.runAway(() => {
      cb();
    });
  }

  getLoot(cb) {
    if (!this.player.curRoom.hasLoot()) { cb(); return;}

    for (let i = 0; i < this.player.curRoom.loot.length; i++) {
      let curItem = this.player.curRoom.loot[i];
      if (curItem && curItem.name) {
        console.log("You picked up a " + curItem.name);
        this.player.addLoot(curItem, cb);
      }
    }

    this.player.curRoom.loot = [];
    return true;
  }

  chooseRole() {
    console.log();
    console.log("Which role would you like to fulfill?");
    console.log();
    console.log("Options:");
    for (let i = 0; i < this.roleOptions.length; i++) {
      console.log(i + ": " + this.roleOptions[i].name);
    }

    Util.rl.question('\n >>', (answer) => {
      let found = false;
      for (let i = 0; i < this.roleOptions.length; i++) {
        if ((answer.toLowerCase() == this.roleOptions[i].name.toLowerCase()) || (answer == ""+i)) {
          found = true;
          this.roleOptions[i].action();
        }
      }
      if (!found) {
        console.log("I don't know what to do with: ", answer);
      }
    });
  }

  tick() {
    //console.log("This is turn..." + this.turn);
    if (this.turn == 1 && !this.player) {
      // This is the first turn of the game.
      //this.chooseRole();
      this.buildAdventurer();
      Util.registerSaveObject("player", this);
      Util.registerSaveObject("dungeon", this);
      return;
    }

    let options = this.coreOptions;
    let isAdventurer = false;

    if (this.player.curRoom == null)
      this.player.curRoom = this.dungeon.entrance;

    console.log(`Stats: ${this.player.name} has ${this.player.health} health ${this.player.mana} mana and is carrying a ${this.player.weapons[0].name} and has ${this.player.armor} defense.`);
    if (this.player.fighting) {
      console.log(`In combat with ${this.player.fighting.name}!`);
    }

    if (this.player.curRoom.hasMonster() && !this.player.fighting) {
      console.log(`This room contains a ${this.player.curRoom.monsters[0].name}!`);
    }

    this.dungeon.drawMap();

    options = this.adventurerOptions;

    if (this.player.curRoom.hasMonster() && this.player.inFight != true) {
      options = this.adventurerMonsterOptions;
    }

    if (this.player.inFight) {
      options = this.adventurerFightOptions;
    }

    console.log("Options:");
    for (let i = 0; i < options.length; i++) {
      if (!options[i].viable || options[i].viable()) {
        console.log(i + ": " + options[i].name);
      }
    }

    Util.rl.question('\n  What would you like to do? ', (answer) => {
      let found = false;
      for (let i = 0; i < options.length; i++) {
        if ((answer.toLowerCase() == options[i].name.toLowerCase()) || (answer == ""+i)) {
          found = true;
          var goAhead = () => {
            this.turn++;
            setTimeout(() => {
              Util.clear();
              this.tick();
            }, 2000);
          }

          let waitForIt = options[i].action(goAhead)
          if (!waitForIt) {
            goAhead();
          }
          return;
        }
      }
      if (!found) {
        console.log("I don't know what to do with: ", answer);
      }
      this.tick();
    });
  }
}

Util.clear();
out("--------------------------------________***************************________--------------------------------");
out();
out("                                     Welcome to a grand new adventure.");
out();
out();
out("Long ago, an evil king hoarded treasure while his people starved.  A traveling wizard from a far away land");
out("heard the king's peoples cry and witnessed their suffering.  The wizard cursed the king and turned him into a ");
out("dragon that cannot taste the food he kept from his people, nor ever fully rest like his slaves.");
out();
out("The dragon flew away - but not without taking as much of his hoard as he could carry.  Rumor has it, this is ");
out("his cave.  ");
out("");
out("The people elected a new king, and have saught far and wide to find an adventurer that could return the kings ");
out("crown.  It is said, that crown will ensure the protection of the kingdom from outside forces, better than any");
out("wall!  The people are desperate to have the crown returned... all other trasures will go to the victor of that");
out("item.");
out();
out("You have taken up their quest.");
out();
out("You face the cave.  Many have entered - none have returned.  Good luck adventurer!");
out("--------------------------------________***************************________--------------------------------");

let game = new Game();
game.tick();

