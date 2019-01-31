var Util = require('./util.js');
var Room = require('./room.js').Room;
var Armor = require('./armor.js').Armor;
var Dungeon = require('./dungeon.js').Dungeon;
var DungeonCore = require('./dungeon.js').DungeonCore;
var Adventurer = require('./adventurer.js').Adventurer;

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
      {name: "View Map", action: () => { this.showMap() }},
    ];

    this.adventurerOptions = [
      {name: "Look", action: () => { this.buildRoom() }},
      {name: "Inspect", action: () => { this.player.curRoom.describe(); }},
      {name: "Pickup", viable: () => {return this.player.curRoom.hasStuff();}, action: () => { this.getStuff() }},
      {name: "Go north", viable: () => {return this.player.curRoom.hasNorth();}, action: () => { this.goNorth() }},
      {name: "Go south", viable: () => {return this.player.curRoom.hasSouth();}, action: () => { this.goSouth() }},
      {name: "Go east", viable: () => {return this.player.curRoom.hasEast();}, action: () => { this.goEast() }},
      {name: "Go west", viable: () => {return this.player.curRoom.hasWest();}, action: () => { this.goWest() }},
      {name: "Go Up", viable: () => {return this.player.curRoom.hasUp();}, action: () => { this.goUp() }},
      {name: "Go Down", viable: () => {return this.player.curRoom.hasDown();}, action: () => { this.goDown() }},
    ];

    this.itemOptions = [
      {name: "Inspect", action: () => { this.inspectRoom() }},
      {name: "Take", action: () => { this.takeObjects() }},
    ];

    this.adventurerMonsterOptions = [
      {name: "Charge", action: (cb) => { this.handleCharge(cb); return true; }},
      {name: "Cast", viable: () => { return this.player.type == "wizard"; }, action: (cb) => { this.handleSpell(cb); return true; }},
      {name: "Shoot", action: () => { this.handleShooting() }},
      {name: "Throw", action: () => { this.handleThrow() }},
      {name: "Communicate", action: () => { this.handleCommunication() }},
      {name: "Run Away", action: () => { this.handleRunAway() }},
    ];

    this.adventurerFightOptions = [
      {name: "Attack", action: (cb) => { this.handleAttack(cb); return true; }},
      {name: "Cast", viable: () => { return this.player.type == "wizard"; }, action: (cb) => { this.handleSpell(cb); return true; }},
      {name: "Run Away", viable: () => { return true; }, action: () => { this.handleRun() }},
    ];

    this.dungeon = new Dungeon(this);
  }

  buildCore() {
    console.log("I see you would like to become a Core!!!");
    this.core = new DungeonCore(this);
    this.core.buildSurvey(() => {
      console.log("You are done building your core!!  Onward!!");
      this.tick();
    });
  }

  buildAdventurer() {
    console.log("I see you would like to become an Adventurer!!!");
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

  showMap() {
    console.log("This is you: ---><---XXX----<>");
    this.turn--;
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
    if (this.player.curRoom.hasNorth()) {
      this.player.curRoom = this.player.curRoom.directions.north;
      this.player.curRoom.describe();
      this.player.curRoom.visited = true;
      this.addManaCheck();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goSouth() {
    if (this.player.curRoom.hasSouth()) {
      this.player.curRoom = this.player.curRoom.directions.south;
      this.player.curRoom.describe();
      this.player.curRoom.visited = true;
      this.addManaCheck();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goEast() {
    if (this.player.curRoom.hasEast()) {
      this.player.curRoom = this.player.curRoom.directions.east;
      this.player.curRoom.describe();
      this.player.curRoom.visited = true;
      console.log("Current room object: ", this.player.curRoom.x, this.player.curRoom.y);
      this.addManaCheck();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goWest() {
    if (this.player.curRoom.hasWest) {
      this.player.curRoom = this.player.curRoom.directions.west;
      this.player.curRoom.describe();
      this.player.curRoom.visited = true;
      console.log("Current room object: ", this.player.curRoom.x, this.player.curRoom.y);
      this.addManaCheck();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
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

  handleAttack(cb) {
    this.player.attack(()=>{
      cb();
    });
  }

  getStuff(cb) {
    for (let i = 0; i < this.player.curRoom.stuff.length; i++) {
      let curItem = this.player.curRoom.stuff[i];
      console.log("You picked up a " + curItem.name);
      if (curItem instanceof Armor) {
        this.player.armorPieces.push(curItem);
      }
    }

    this.player.curRoom.stuff = [];
    this.player.updateStats();
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
      return;
    }

    let options = this.coreOptions;
    let isAdventurer = false;
    console.log(`Stats: ${this.player.name} has ${this.player.health} health ${this.player.mana} mana and is carrying a ${this.player.weapons[0].name} and has ${this.player.armor} defense.`);
    if (this.player.inFight) {
      console.log(`In combat with ${this.player.fighting.name}!`);
    }
    this.dungeon.drawMap();

    options = this.adventurerOptions;
    if (this.player.curRoom == null)
      this.player.curRoom = this.dungeon.entrance;

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
out("Lets get started...");
out();
out("--------------------------------________***************************________--------------------------------");

let game = new Game();
game.tick();

