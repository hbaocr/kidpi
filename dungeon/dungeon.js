var Room = require("./room.js").Room;
var Util = require("./util.js");
class Dungeon {
  constructor(game) {
    this.game = game;
    this.name= "unset";
    this.type = "unset";
    this.rooms = [];
    this.roomFactor = 10;
    this.roomGrid = [];
    for (let i = 0; i < this.roomFactor; i++) { this.roomGrid[i] = []; this.roomGrid[i].length = this.roomFactor; }

    this.entrance = new Room();
    this.entrance.name = "Entrance";
    this.entrance.type = "Start";
    this.entrance.attributes = [Room.attrs[0]];
    this.entrance.visited = true;

    let prevRoom = this.entrance;
    let buildPosX = Math.floor(this.roomFactor/2);
    let buildPosY = 0;
    prevRoom.x = buildPosX;
    prevRoom.y = buildPosY;
    this.roomGrid[buildPosY][buildPosX] = this.entrance;

    this.lastRoomX = Math.floor(this.roomFactor/2 + (Math.random() * (this.roomFactor/2)));
    this.lastRoomY = Math.floor(this.roomFactor/2 + (Math.random() * (this.roomFactor/2)));
    console.log("Boss room is at: ", this.lastRoomX, this.lastRoomY);

    while (true) {
      if (buildPosX == this.lastRoomX && buildPosY == this.lastRoomY) {
        break;
      }
      let direction = Math.floor(Math.random() * 4);
      let compassDir = "";
      let prevPosition = [buildPosX, buildPosY];

      if (direction == 0) {
        buildPosY--;
        compassDir = "north";
      } else if (direction == 1) {
        buildPosX++;
        compassDir = "east";
      } else if (direction == 2) {
        buildPosX--;
        compassDir = "west";
      } else if (direction == 3) {
        buildPosY++;
        compassDir = "south";
      }

      if (buildPosY > this.roomFactor - 1) {
        buildPosY = prevPosition[1];
        continue;
      }

      if (buildPosY < 0) {
        buildPosY = prevPosition[1];
        continue;
      }

      if (buildPosX > this.roomFactor - 1) {
        buildPosX = prevPosition[0];
        continue;
      }

      if (buildPosX < 0) {
        buildPosX = prevPosition[0];
        continue;
      }

      prevRoom = this.roomGrid[prevPosition[1]][prevPosition[0]];
      if (this.roomGrid[buildPosY][buildPosX] == null) {
        let room = new Room();
        room.randomize();
        room.x = buildPosX;
        room.y = buildPosY;
        prevRoom.directions[compassDir] = room;
        this.roomGrid[buildPosY][buildPosX] = room;
        this.rooms.push(room);
        room.directions[Util.getOppositeDirection(compassDir)] = prevRoom;

        //Keep going.
        prevRoom = room;
      }
    }
    this.drawMap();
  }

  drawMap() {
    for (let i = 0; i < this.roomFactor; i++) {
      let rowDesc = "";
      for (let j = 0; j < this.roomFactor; j++) {
        let player = null;
        if (this.game && this.game.player) {
          player = this.game.player;
        }
        if (player && player.curRoom && this.roomGrid[i][j] == player.curRoom) {
          rowDesc += "A";
        } else if (this.roomGrid[i][j] && this.roomGrid[i][j].visited) {
          rowDesc += "X";
        } else if (this.roomGrid[i][j]) {
          rowDesc += "*";
        } else {
          rowDesc += ".";
        }

      }
      console.log(rowDesc);
    }
  }

  pickDirection(prevRoom) {
    // Pick a direction to attach this new room to.
    let direction = Util.getRandom(["east", "west", "north", "south"]);
    while (prevRoom.directions[direction] != null) {
      direction = Util.getRandom(["east", "west", "north", "south"]);
    }

    return direction;
  }

  describe() {
    console.log("The dungeon is dangerous.");
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
