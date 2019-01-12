let dungeon = {};

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Game {
  constructor() {
    this.turn = 1;
    this.turnOptions = [
      {name: "Build room", action: this.buildRoom},
      {name: "Build trap", action: this.buildTrap},
      {name: "Create Monster", action: this.buildMonster},
    ];
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

  tick() {
    console.log("This is turn..." + this.turn);
    console.log("Options:");
    for (let i = 0; i < this.turnOptions.length; i++) {
      console.log(i + ": " + this.turnOptions[i].name);
    }

    rl.question('\n  What would you like to do? ', (answer) => {
      let found = false;
      for (let i = 0; i < this.turnOptions.length; i++) {
        if (answer.toLowerCase() == this.turnOptions[i].name.toLowerCase()) {
          found = true;
          this.turnOptions[i].action()
          this.turn++;
        }
      }
      if (!found) {
        console.log("I don't know what to do with: ", answer);
      }
      this.tick();
    });
  }
}

class Room {
  constructor() {
    this.name= "unset";
    this.type = "unset";
    this.treasures = [];
    this.monsters = [];
    this.traps = [];
    this.directions = {
      east: null,
      west: null,
      north: null,
      south: null,
      down: null,
      up: null,
    }
    this.attributes = [
      "wet",
      "hot"
    ];
  }

  describe() {
    console.log("The room is: ");
  }
}

class DungeonCore {
  constructor() {
    this.name = "unset";
    this.type = "unset";
    this.manaPerTurn = 1;
    this.mana = 0;
  }
}

class Adventurer {
  constructor() {
    this.name = "unset";
    this.type = "unset";
    this.armor = 0;
    this.weapons = [];
  }
}

let game = new Game();
let start = new Room();

start.name = "home sweet home";
start.type = "home";
start.core = new DungeonCore();

dungeon.start = start;
game.tick();


