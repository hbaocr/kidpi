var Util = require('./util.js');

class Adventurer {
  constructor(game) {
    this.game = game;
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
      let curQuestion = this.buildQuestions[this.curBuildQuestion];
      let options = "(";
      for ( let o in curQuestion.answers ) {
        options += o + ", ";
      }

      options += ")";

      Util.rl.question('\n '+curQuestion.q + " " + options + '\n>>', (answer) => {
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

module.exports.Adventurer = Adventurer;
