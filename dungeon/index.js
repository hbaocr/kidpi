var Util = require('./util.js');
var Room = require('./room.js').Room;
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
      {name: "Inspect", action: () => { this.inspectRoom() }},
      {name: "Go north", action: () => { this.goNorth() }},
      {name: "Go east", action: () => { this.goEast() }},
      {name: "Go south", action: () => { this.goSouth() }},
      {name: "Go west", action: () => { this.goWest() }},
    ];

    this.itemOptions = [
      {name: "Inspect", action: () => { this.inspectRoom() }},
      {name: "Take", action: () => { this.takeObjects() }},
    ];

    this.adventurerMonsterOptions = [
      {name: "Charge", action: () => { this.handleCharge() }},
      {name: "Shoot", action: () => { this.handleShooting() }},
      {name: "Throw", action: () => { this.handleThrow() }},
      {name: "Communicate", action: () => { this.handleCommunication() }},
      {name: "Run Away", action: () => { this.handleRunAway() }},
    ];

    this.adventurerFightOptions = [
      {name: "Attack", action: () => { this.handleAttack() }},
      {name: "Run Away", action: () => { this.handleRun() }},
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

  goNorth() {
    if (this.player.curRoom.hasNorth()) {
      this.player.curRoom = this.player.curRoom.directions.north;
      this.player.curRoom.describe();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goSouth() {
    if (this.player.curRoom.hasSouth()) {
      this.player.curRoom = this.player.curRoom.directions.south;
      this.player.curRoom.describe();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goEast() {
    if (this.player.curRoom.hasEast()) {
      this.player.curRoom = this.player.curRoom.directions.east;
      this.player.curRoom.describe();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goWest() {
    if (this.player.curRoom.hasWest) {
      this.player.curRoom = this.player.curRoom.directions.west;
      this.player.curRoom.describe();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  handleCharge() {
    out("You have decided to enage the " + this.player.curRoom.monsters[0].name + " with your " +
        this.player.weapons[0].name);
    this.player.inFight = true;
    this.player.fighting = this.player.curRoom.monsters[0];
  }

  handleAttack(cb) {
    this.player.attack(()=>{
    });
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
    //console.log("con: " + this.player.constructor.name);
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
      console.log(i + ": " + options[i].name);
    }

    console.log("Current room: ", this.player.curRoom.name);
    if (this.player.curRoom) {
      this.player.curRoom.describe();
    }

    Util.rl.question('\n  What would you like to do? ', (answer) => {
      let found = false;
      for (let i = 0; i < options.length; i++) {
        if ((answer.toLowerCase() == options[i].name.toLowerCase()) || (answer == ""+i)) {
          found = true;
          options[i].action()
          this.turn++;
          setTimeout(() => {
            Util.clear();
            this.tick();
          }, 3000);
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

