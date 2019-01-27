const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Game {
  constructor() {
    this.turn = 1;
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
  }

  buildCore() {
    console.log("I see you would like to become a Core!!!");
    start.core = new DungeonCore();
    start.core.buildSurvey(() => {
      console.log("You are done building your core!!  Onward!!");
      this.tick();
    });
  }

  buildAdventurer() {
    console.log("I see you would like to become an Adventurer!!!");
    start.adventurer = new Adventurer();
    start.adventurer.buildSurvey(() => {
      console.log("You are done building your Adventurer!!  Onward!!");
      this.tick();
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
    if (player.curRoom.directions.north) {
      player.curRoom = player.curRoom.directions.north;
      player.curRoom.describe();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goSouth() {
    if (player.curRoom.directions.south) {
      player.curRoom = player.curRoom.directions.south;
      player.curRoom.describe();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goEast() {
    if (player.curRoom.directions.east) {
      player.curRoom = player.curRoom.directions.east;
      player.curRoom.describe();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goWest() {
    if (player.curRoom.directions.west) {
      player.curRoom = player.curRoom.directions.west;
      player.curRoom.describe();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  chooseRole() {
    console.log("Which role would you like to fulfill?");
    console.log("Options:");
    for (let i = 0; i < this.roleOptions.length; i++) {
      console.log(i + ": " + this.roleOptions[i].name);
    }

    rl.question('\n >>', (answer) => {
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
    console.log("This is turn..." + this.turn);
    if (this.turn == 1 && !player) {
      // This is the first turn of the game.
      this.chooseRole();
      return;
    }

    let options = this.coreOptions;
    let isAdventurer = false;
    console.log("con: " + player.constructor.name);
    if (player.constructor.name == "Adventurer") {
      options = this.adventurerOptions;
      isAdventurer = true;
      if (player.curRoom == null) 
        player.curRoom = dungeon.entrance;
    }

    console.log("Options:");
    for (let i = 0; i < options.length; i++) {
      console.log(i + ": " + options[i].name);
    }

    if (isAdventurer) {
      console.log("Current room: ", player.curRoom);
      if (player.curRoom) {
        player.curRoom.describe();
      }

      if (player.curRoom && player.curRoom.monsters.length > 0) {
        for (let i = 0; i < this.adventurerMonsterOptions.length; i++) {
          console.log(i + ": " + this.adventurerMonsterOptions[i].name);
        }
      }
    }

    rl.question('\n  What would you like to do? ', (answer) => {
      let found = false;
      for (let i = 0; i < options.length; i++) {
        if ((answer.toLowerCase() == options[i].name.toLowerCase()) || (answer == ""+i)) {
          found = true;
          options[i].action()
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

function getOppositeDirection(dir) {
  return {
    "east": "west",
    "west": "east",
    "north": "south",
    "south": "north" }[dir];
}

class Dungeon {
  constructor() {
    this.name= "unset";
    this.type = "unset";
    this.rooms = [];
    this.rooms.length = 100;
    this.entrance = new Room();
    this.entrance.name = "Entrance";
    this.entrance.type = "Start";
    this.entrance.attributes = [
      "dark",
      "cold"
    ];

    let prevRoom = this.entrance;
    for (let i = 0; i < this.rooms.length; i++) {
      let curRoom = new Room();
      this.rooms[i] = curRoom;
      curRoom.randomize();
      let direction = getRandom(["east", "west", "north", "south"]);
      while (prevRoom.directions[direction] != null) {
        direction = getRandom(["east", "west", "north", "south"]);
      }
      prevRoom.directions[direction] = curRoom;
      curRoom.directions[getOppositeDirection(direction)] = prevRoom;
      prevRoom = curRoom;
    }
  }

  describe() {
    console.log("The room is: ");
    let curRoom = this.entrance;
    let path = "";
    let prevRoom = this.entrance;
    this.entrance.visited = true;
    while(curRoom.directions.east ||
      curRoom.directions.west||
      curRoom.directions.north||
      curRoom.directions.south) {

      let found = false;
      if (curRoom.directions.east && !curRoom.directions.east.visted) {
        console.log("Going East");
        curRoom = curRoom.directions.east;
        curRoom.visted = true;
        found = true;
        path += "<-";
      }

      if (curRoom.directions.west && !curRoom.directions.west.visted) {
        console.log("Going West");
        curRoom = curRoom.directions.west;
        curRoom.visted = true;
        found = true;
        path += "->";
      }

      if (curRoom.directions.north && !curRoom.directions.north.visted) {
        console.log("Going North");
        curRoom = curRoom.directions.north;
        curRoom.visted = true;
        found = true;
        path += "^";
      }

      if (curRoom.directions.south && !curRoom.directions.south.visted) {
        console.log("Going South");
        curRoom = curRoom.directions.south;
        curRoom.visted = true;
        found = true;
        path += "v";
      }

      if (found) {
        curRoom.describe();
      } else {
        break;
      }

    }
    console.log(path);
  }
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomProp(obj) {
  let keys = Object.keys(obj);
  return obj[keys[Math.floor(Math.random() * keys.length)]];
}

class Room {
  constructor() {
    this.name= "unset";
    this.type = "unset";
    this.treasures = [];
    this.monsters = [];
    this.stuff = [];
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
    ];
  }

  randomize() {
    this.name = Math.floor(Math.random() * 1000000);
    this.monsters.push(getRandomProp(Room.monster_options));
    this.attributes.push(getRandom(Room.attrs));
    this.stuff.push(getRandomProp(Room.stuff_options));
  }

  describe() {
    console.log("The room is: ", this.attributes[0].attr, " it has a ", this.monsters[0], " and you can see ", this.stuff[0]);
    for (var dir in this.directions) {
      if (this.directions[dir]) {
        console.log("You can go: ", dir);
      }
    }
  }
}

Room.stuff_options = {
  shelf: "shelf",
  chest: "chest",
  bed: "bed",
  statue: "statue",
  pool: "pool",
  mushrooms: "mushrooms",
  stalagtites: "stalagtites"
}

Room.monster_options = {
  slime : {
    name:"slime",
    health: 2,
    armor : 1,
    strength : 1,
    speed : 1,
    manaPerTurn : 0,
    lootClass: "junk",
    weapons : { name: "snot", parts: ["snot"]},
  },
  giant_slime : {
    name:"giant slime",
    health: 5,
    armor : 3,
    strength : 3,
    speed : 1,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : { name: "heavy snot", parts: ["heavy snot"]},
  },
  slime_swarm: {
    name:"slime swarm",
    health: 5,
    armor : 1,
    strength : 1,
    speed : 4,
    manaPerTurn : 0,
    lootClass: "junk",
    weapons : { name: "snot storm", parts: ["snot storm"]},
  },
  skeleton: {
    name:"skeleton",
    health: 3,
    armor : 2,
    strength : 2,
    speed : 2,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : { name: "rusty sword", parts: ["rusty sword"]},
  },
  zombie: {
    name:"zombie",
    health: 5,
    armor : 2,
    strength: 4,
    speed: 1,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : { name: "claws", parts: ["claws"]},
  },
  giant_spider: {
    name:"giant spider",
    health: 5,
    armor : 1,
    strength: 3,
    speed: 2,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : { name: "poisonous fangs", parts: ["poisonous fangs"]},
  },
  mimic: {
    name:"chest",
    health: 5,
    armor : 4,
    strength: 6,
    speed: 2,
    manaPerTurn : 0,
    lootClass: "high",
    weapons : { name: "teeth", parts: ["teeth"]},
  },
  demon: {
    name:"demon",
    health: 15,
    armor : 10,
    strength: 6,
    speed: 3,
    manaPerTurn : 1,
    lootClass: "exceptional",
    weapons : { name: "teeth", parts: ["teeth"]},
  },
}

class Monster {
}

Monster.lootClass = {
  "junk" : [
  ],
  "low" : [
  ],
  "mid" : [
  ],
  "high" : [
  ],
  "rare" : [
  ],
  "exceptional" : [
  ],
  "oneofakind" : [
  ],
}

Room.attrs = [
  {attr: "wet", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["dry"]},
  {attr: "cold", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.bed,
  ], notattrs:["hot", "humid"]},
  {attr: "slimy", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["dry"]},
  {attr: "dark", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
    Room.stuff_options.bed,
  ], notattrs:["bright"]},
  {attr: "humid", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["dry","cold"]},
  {attr: "hot", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["cold"]},
  {attr: "bright", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["dark", "cavelike"]},
  {attr: "cavelike", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["bright"]},
  {attr: "dry", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["wet","slimy"]},
]


class DungeonCore {
  constructor() {
    this.name = "unset";
    this.type = "unset";
    this.manaPerTurn = 1;
    this.mana = 0;
    this.surveyCallback = null;

    this.curBuildQuestion = 0;
    this.buildQuestions = [
      {q: "What do you want to call yourself?", confirmation: "Your name is: ",
        answers: {"any": (value) => {
          this.nameAccepted(value);
        }}
      },
      {q: "Is this correct? T or F",
          confirmation: "Great!",
          answers: { 
            "t":(value) => {
              console.log("Done.");
              this.curBuildQuestion++;
              this.buildSurvey();
            },
            "f": (value) => {
              this.nameNotAccepted(value);
            }
          }
      }
    ];
  }

  nameAccepted(name) {
    this.name = name;
    console.log("Great! Your name is: " + this.name);
    // This is the global player object.
    player = this;
    this.curBuildQuestion++;
    this.buildSurvey();
  }

  nameNotAccepted() {
    console.log("Drat! Try again.");
    this.curBuildQuestion--;
    this.buildSurvey();
  }

  buildSurvey(cb) {
    if (cb) {
      this.surveyCallback = cb;
    }
    console.log("You are on question: ", this.curBuildQuestion, " of ", this.buildQuestions.length - 1);
    if (this.curBuildQuestion < this.buildQuestions.length) {
      console.log("Next question....");
      rl.question('\n '+this.buildQuestions[this.curBuildQuestion].q +'\n>>', (answer) => {
        if (this.buildQuestions[this.curBuildQuestion].answers) {
          if (this.buildQuestions[this.curBuildQuestion].answers["any"]) {
            this.buildQuestions[this.curBuildQuestion].answers["any"](answer);
            return;
          }

          var found = false;
          for (let i in this.buildQuestions[this.curBuildQuestion].answers) {
            if (answer.toLowerCase() == i) {
              found = true;
              this.buildQuestions[this.curBuildQuestion].answers[i](answer);
            }
          }

          if (!found) {
            console.log("That is not an answer I recognize.  Try again!");
            this.buildSurvey();
          }
        }
      });
    } else {
      console.log("All done.");
      this.surveyCallback();
    }
  }
}

class Adventurer {
  constructor() {
    this.name = "unset";
    this.type = "unset";
    this.armor = 0;
    this.strength = 0;
    this.speed = 0;
    this.health = 10;
    this.manaPerTurn = 0;
    this.curRoom = null;

    this.armorPieces = [];
    this.weapons = [];

    this.curBuildQuestion = 0;
    this.buildQuestions = [
      {q: "What do you want to call yourself?", confirmation: "Your name is: ",
        answers: {"any": (value) => {
          this.nameAccepted(value);
        }}
      },
      {q: "Is this correct? ",
          confirmation: "Great!",
          answers: { 
            "t":(value) => {
              console.log("Done.");
              this.curBuildQuestion++;
              this.buildSurvey();
            },
            "f": (value) => {
              this.nameNotAccepted(value);
            }
          }
      },
      {q: "What class?",
          confirmation: "Great!",
          answers: { 
            "Rogue":(value) => {
              this.type = value;
              this.armor = 1;
              this.strength = 2;
              this.speed = 4;
              this.manaPerTurn = 0;
              this.weapons[0] = { name: "daggers", parts: ["dagger", "dagger"]};
              this.curBuildQuestion++;
              this.buildSurvey();
            },
            "Wizard": (value) => {
              this.type = value;
              this.armor = 0;
              this.strength = 2;
              this.speed = 3;
              this.manaPerTurn = 2;
              this.weapons[0] = { name: "staff", parts: ["staff"]};
              this.curBuildQuestion++;
              this.buildSurvey();
            },
            "Archer": (value) => {
              this.type = value;
              this.armor = 2;
              this.strength = 3;
              this.speed = 2;
              this.manaPerTurn = 0;
              this.weapons[0] = { name: "bow", parts: ["bow", "quiver", 10]};
              this.curBuildQuestion++;
              this.buildSurvey();
            },
            "Fighter": (value) => {
              this.type = value;
              this.armor = 3;
              this.strength = 3;
              this.speed = 1;
              this.manaPerTurn = 0;
              this.weapons[0] = { name: "short sword", parts: ["short sword"]};
              this.curBuildQuestion++;
              this.buildSurvey();
            }
          }
      }
    ];
  }

  nameAccepted(name) {
    this.name = name;
    console.log("Great! Your name is: " + this.name);
    // This is the global player object.
    player = this;
    this.curBuildQuestion++;
    this.buildSurvey();
  }

  nameNotAccepted() {
    console.log("Drat! Try again.");
    this.curBuildQuestion--;
    this.buildSurvey();
  }

  buildSurvey(cb) {
    if (cb) {
      this.surveyCallback = cb;
    }

    console.log("You are on question: ", this.curBuildQuestion, " of ", this.buildQuestions.length - 1);
    if (this.curBuildQuestion < this.buildQuestions.length) {
      console.log("Next question....");
      let curQuestion = this.buildQuestions[this.curBuildQuestion];
      let options = "(";
      for ( let o in curQuestion.answers ) {
        options += o + ", ";
      }

      options += ")";

      rl.question('\n '+curQuestion.q + " " + options + '\n>>', (answer) => {
        if (curQuestion.answers) {
          if (this.buildQuestions[this.curBuildQuestion].answers["any"]) {
            this.buildQuestions[this.curBuildQuestion].answers["any"](answer);
            return;
          }

          var found = false;
          for (let i in this.buildQuestions[this.curBuildQuestion].answers) {
            if (answer.toLowerCase() == i.toLowerCase()) {
              found = true;
              this.buildQuestions[this.curBuildQuestion].answers[i](answer);
            }
          }

          if (!found) {
            console.log("That is not an answer I recognize.  Try again!");
            this.buildSurvey();
          }
        }
      });
    } else {
      console.log("All done.");
      this.surveyCallback();
    }
  }
}

let dungeon = new Dungeon();
dungeon.describe();
let game = new Game();
let start = new Room();
let player = null;

start.name = "home sweet home";
start.type = "home";

dungeon.start = start;
game.tick();


