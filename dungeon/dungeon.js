var Room = require("./room.js").Room;
var Util = require("./util.js");
class Dungeon {
  constructor() {
    this.name= "unset";
    this.type = "unset";
    this.rooms = [];
    this.rooms.length = 100;
    this.entrance = new Room();
    this.entrance.name = "Entrance";
    this.entrance.type = "Start";
    this.entrance.attributes = [Room.attrs[0]];

    let prevRoom = this.entrance;
    for (let i = 0; i < this.rooms.length; i++) {
      let curRoom = new Room();
      this.rooms[i] = curRoom;
      curRoom.randomize();
      let direction = Util.getRandom(["east", "west", "north", "south"]);
      while (prevRoom.directions[direction] != null) {
        direction = Util.getRandom(["east", "west", "north", "south"]);
      }
      prevRoom.directions[direction] = curRoom;
      curRoom.directions[Util.getOppositeDirection(direction)] = prevRoom;
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


class DungeonCore {
  constructor(game) {
    this.game = game;
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
    this.game.player = this;
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
      Util.rl.question('\n '+this.buildQuestions[this.curBuildQuestion].q +'\n>>', (answer) => {
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

module.exports.Dungeon = Dungeon;
module.exports.DungeonCore = DungeonCore;
