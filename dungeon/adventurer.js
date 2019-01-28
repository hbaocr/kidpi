var Util = require('./util.js');
var Weapon = require('./weapon.js').Weapon;

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
    this.inFight = false;
    this.fighting = null;

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
              this.nextQuestion();
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
              this.weapons[0] = new Weapon("daggers", "stabby", "dagger", "dagger", null, 1);
              this.nextQuestion();
            },
            "Wizard": (value) => {
              this.type = value;
              this.armor = 0;
              this.strength = 2;
              this.speed = 3;
              this.manaPerTurn = 2;
              this.weapons[0] = new Weapon("staff", "stick", "-", "-", null, 1);
              this.nextQuestion();
            },
            "Archer": (value) => {
              this.type = value;
              this.armor = 2;
              this.strength = 3;
              this.speed = 2;
              this.manaPerTurn = 0;
              this.weapons[0] = new Weapon("bow", "bow", "-", "-", 30, 1);
              this.nextQuestion();
            },
            "Fighter": (value) => {
              this.type = value;
              this.armor = 3;
              this.strength = 3;
              this.speed = 1;
              this.manaPerTurn = 0;
              this.weapons[0] = new Weapon("short sword", "stabby", "", "short sword", null, 3);
              this.nextQuestion();
            }
          }
      }
    ];
  }

  attack(cb) {
    console.log("ATTACK!!!!!");
    console.log("You swing with your " + this.weapons[0].name);
    console.log("It does " + this.weapons[0].damage + " damage  to " + this.fighting);
    this.fighting.health -= this.weapons[0].damage;
    console.log(this.fighting.name + " has " + this.fighting.health + " health left!");
    if ( this.fighting.health <= 0 ) {
      this.inFight = false;
      this.curRoom.monsters = [];
      console.log("You have vanquished " + this.fighting.name);
    }
    cb();
  }

  nameAccepted(name) {
    this.name = name;
    console.log("Great! Your name is: " + this.name);
    // This is the global player object.
    this.game.player = this;
    this.nextQuestion(false);
  }

  nameNotAccepted() {
    console.log("Drat! Try again.");
    this.curBuildQuestion--;
    this.curBuildQuestion--;
    this.nextQuestion();
  }

  nextQuestion(shouldClear) {
    if (shouldClear !== false) {
      shouldClear = true;
    }
    this.curBuildQuestion++;
    setTimeout(() => {
      if (shouldClear) {
        console.log('\x1Bc');
      }
      this.buildSurvey();
    }, 500);
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
