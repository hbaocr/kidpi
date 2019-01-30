var Util = require('./util.js');
var Weapon = require('./weapon.js').Weapon;
var Spell = require('./spells.js').Spell;

class Adventurer {
  constructor(game) {
    this.game = game;
    this.name = "unset";
    this.type = "unset";
    this.armor = 0;
    this.strength = 0;
    this.speed = 0;
    this.health = 10;
    this.mana = 0;
    this.curRoom = null;
    this.inFight = false;
    this.fighting = null; // Which monster is currently engaged.

    this.armorPieces = [];
    this.weapons = [];
    this.spells = [];

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
              this.mana = 0;
              this.weapons[0] = new Weapon("daggers", "stabby", "dagger", "dagger", null, 2);
              this.nextQuestion();
            },
            "Wizard": (value) => {
              this.type = value;
              this.armor = 0;
              this.strength = 2;
              this.speed = 3;
              this.mana = 30;
              this.maxMana = 300;
              this.weapons[0] = new Weapon("staff", "stick", "-", "-", null, 1);
              this.spells[0] = new Spell("Fireball", Spell.types.damaging, 3, 3, 7);
              this.nextQuestion();
            },
            "Archer": (value) => {
              this.type = value;
              this.armor = 2;
              this.strength = 3;
              this.speed = 2;
              this.mana = 0;
              this.weapons[0] = new Weapon("bow", "bow", "-", "-", 30, 1);
              this.nextQuestion();
            },
            "Fighter": (value) => {
              this.type = value;
              this.armor = 3;
              this.strength = 3;
              this.speed = 1;
              this.mana = 0;
              this.weapons[0] = new Weapon("short sword", "stabby", "", "short sword", null, 3);
              this.nextQuestion();
            }
          }
      }, {
        q: "What kind of wizard?",
          confirmation: "Success!",
          viable: () => {return this.type == "wizard";},
          answers: {
            "Pyromancer": () => {
              this.wizardType = "fire",
              this.spells[0] = new Spell("Fireball", Spell.types.damaging, 3, 3, 7);
              this.nextQuestion();
            },
            "Aquamancer": () => {
              this.wizardType = "water",
              this.spells[0] = new Spell("Icelance", Spell.types.damaging, 2, 3, 8);
              this.nextQuestion();
            },
            "Chronomancer": () => {
              this.wizardType = "time",
              this.spells[0] = new Spell("Timetear", Spell.types.damaging, 5, 3, 5);
              this.nextQuestion();
            },
            "Necromancer": () => {
              this.wizardType = "death",
              this.spells[0] = new Spell("Rot", Spell.types.damaging, 7, 3, 3);
              this.nextQuestion();
            },
          }
      },
    ];
  }

  playerAttack(spell, cb) {
    if (!spell) {
      console.log("\n\nYou swing with your " + this.weapons[0].name);
    } else {
      console.log("\n\nYou cast " + spell.name);
    }

    // Check to see if we hit.
    setTimeout(() => {
      if (Util.hitCheck((spell ? spell.focus : this.speed), this.fighting.speed)) {
        console.log("\n\n\nHit!!");
        let damage = this.weapons[0].damage;
        if (spell) {
          damage = spell.effect;
        }

        console.log("\nIt does " + damage + " damage to " + this.fighting.name);
        if (spell) {
          this.fighting.health -= this.spells[0].effect;
        } else {
          this.fighting.health -= this.weapons[0].damage;
        }
        console.log(this.fighting.name + " has " + this.fighting.health + " health left!");
      } else {
        console.log("\n\n\nOh no! You missed!!");
        console.log(this.fighting.name + " has " + this.fighting.health + " health left!");
      }
      cb();
    }, 2000);
  }

  monsterAttack(cb) {
    // Uh, oh - see if they get to swing back...
    let weapon = Util.getRandom(this.fighting.weapons);
    console.log();
    console.log(`${this.fighting.name} sizes you up and swings with his ${weapon.name}...`);
    setTimeout(() => {
      if (Util.hitCheck(this.fighting.speed, this.speed)) {
        let damage = weapon.damage - Math.floor(Math.random() * this.armor);
        if (damage <= 0) {
          damage = 0;
          console.log("Your armor deflected his blow!  No damage!!!");
          setTimeout(() => { cb(); }, 2000);
        } else {
          console.log(`Ouch!  The ${this.fighting.name} hit you with his ${weapon.name}!!!`);
          console.log(`You took ${damage} damage.`);
          this.health -= damage;
          if (this.health <= 0) {
            console.log(".");
            console.log(".");
            console.log(".");
            console.log(".");
            console.log(".");
            console.log(".");
            console.log(".");
            console.log(".");
            console.log("v");
            console.log("You are dead.");
            console.log("You are dead.");
            setTimeout(() => {
              console.log("So dead.");
              setTimeout(() => {
                console.log("So sad.");
              }, 3000);
            }, 3000);
          } else {
            console.log("You lived!!!");
            setTimeout(() => { cb(); }, 1000);
          }
        }
      } else {
        console.log(`He missed with his ${weapon.name}!!!`);
        cb();
      }
    }, 2000);// Suspense. ;)
  }

  attack(cb, spell) {
    console.log("ATTACK!!!!!");

    if (spell) {
      console.log("Using spell: ", spell.name);
    }

    this.playerAttack(spell, () => {
      // See if the beast is still alive.
      if ( this.fighting.health <= 0 ) {
        this.inFight = false;
        this.curRoom.monsters = [];
        console.log("You have vanquished " + this.fighting.name + "!!!");
        setTimeout(() => { cb(); }, 3000);
      } else {
        setTimeout(() => {
          this.monsterAttack(cb);
        }, 1000);
      }
    });
  }

  cast(cb) {
    let spell = this.spells[0];
    if (spell.type == Spell.types.damaging || 
      spell.type == "revealing") {
      this.inFight = true;
      this.fighting = this.curRoom.monsters[0];
    }

    if (this.mana > spell.mana) {
      this.mana -= spell.mana;
      this.attack(cb, spell);
    } else {
      console.log("You attempt to cast " + spell.name + " but fail.");
      setTimeout(() => {
        this.monsterAttack(cb);
      }, 1000);
    }
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

  nextQuestion(shouldClear, shouldNotWait) {
    if (shouldClear !== false) {
      shouldClear = true;
    }
    this.curBuildQuestion++;
    setTimeout(() => {
      if (shouldClear) {
        console.log('\x1Bc');
      }
      this.buildSurvey();
    }, (shouldNotWait ? 0 : 500));
  }

  buildSurvey(cb) {
    if (cb) {
      this.surveyCallback = cb;
    }

    console.log("You are on question: ", this.curBuildQuestion, " of ", this.buildQuestions.length - 1);

    if (this.curBuildQuestion < this.buildQuestions.length) {
      console.log("Next question....");
      let curQuestion = this.buildQuestions[this.curBuildQuestion];
      if (curQuestion.viable && !curQuestion.viable()) {
        this.curBuildQuestion++;
        this.buildSurvey(cb);
        return;
      }

      let options = "(";
      let optionCt = 0;
      for ( let o in curQuestion.answers ) {
        if (options.length > 1) { options += ", ";}

        optionCt++

        if (o != "any") {
          options += optionCt + ": ";
          curQuestion.answers[o].optionCt = optionCt;
        }

        options += o;
      }

      options += ")";

      Util.rl.question('\n '+curQuestion.q + " " + options + '\n>>', (answer) => {
        if (curQuestion.answers) {
          if (curQuestion.answers["any"]) {
            curQuestion.answers["any"](answer);
            return;
          }

          var found = false;
          for (let i in curQuestion.answers) {
            let curAnswer = curQuestion.answers[i];
            if (answer.toLowerCase() == i.toLowerCase() ||
              (answer - 0 == curAnswer.optionCt)) {
              found = true;
              console.log("You said: ", answer, ":", i);
              curQuestion.answers[i](i.toLowerCase());
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