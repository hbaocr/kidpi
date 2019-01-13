let dungeon = {};

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
      {name: "Go north", action: () => { this.buildTrap() }},
      {name: "Go east", action: () => { this.buildTrap() }},
      {name: "Go south", action: () => { this.buildTrap() }},
      {name: "Go west", action: () => { this.buildTrap() }},
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
    console.log("con: " + player.constructor.name);
    if (player.constructor.name == "Adventurer") {
      options = this.adventurerOptions;
    }

    console.log("Options:");
    for (let i = 0; i < options.length; i++) {
      console.log(i + ": " + options[i].name);
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

let game = new Game();
let start = new Room();
let player = null;

start.name = "home sweet home";
start.type = "home";

dungeon.start = start;
game.tick();


