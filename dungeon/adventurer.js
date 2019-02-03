var Util = require('./util.js');
var Weapon = require('./weapon.js').Weapon;
var Spell = require('./spells.js').Spell;
var Armor = require('./armor.js').Armor;

class Adventurer {
  constructor(game) {
    this.game = game;
    this.name = "unset";
    this.type = "unset";
    this.armor = 0;
    this.baseArmor = 0;
    this.strength = 0;
    this.speed = 0;
    this.health = 10;
    this.mana = 0;
    this.curRoom = null;
    this.prevRoom = null;
    this.inFight = false;
    this.fighting = null; // Which monster is currently engaged.

    this.armorPieces = [];
    this.weapons = [];
    this.spells = [];
    this.backpack = [];

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
              this.baseArmor = 1;
              this.strength = 2;
              this.speed = 4;
              this.mana = 0;
              this.weapons[0] = new Weapon("fists", "blunt", "-", "-", null, 1);
              this.nextQuestion();
            },
            "Wizard": (value) => {
              this.type = value;
              this.armor = 0;
              this.baseArmor = 0;
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
              this.baseArmor = 2;
              this.strength = 3;
              this.speed = 2;
              this.mana = 0;
              this.weapons[0] = new Weapon("fists", "blunt", "-", "-", null, 1);
              this.nextQuestion();
            },
            "Fighter": (value) => {
              this.type = value;
              this.armor = 3;
              this.baseArmor = 3;
              this.strength = 3;
              this.speed = 1;
              this.mana = 0;
              this.weapons[0] = new Weapon("fists", "blunt", "-", "-", null, 1);
              this.nextQuestion();
            },
            "hidden": (value) => {
              this.type = value;
              this.armor = 3;
              this.baseArmor = 30;
              this.strength = 30;
              this.speed = 30;
              this.mana = 0;
              this.weapons[0] = new Weapon("short sword", "stabby", "", "short sword", null, 1);
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
        let damage = this.weapons[0].damage * (Math.floor(Math.random() * this.strength));
        if (spell) {
          damage = spell.effect;
        }

        // Checking monsters armor.
        damage = damage - Math.floor(Math.random() * this.fighting.armor);

        if (damage <= 0) {
          console.log("\nYour blow is deflected by the monsters armor!");
        } else {
          console.log("\nIt does " + damage + " damage to " + this.fighting.name);
        }

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
        let damage = weapon.damage * (Math.floor(Math.random() * this.fighting.strength));;
        damage = damage - Math.floor(Math.random() * this.armor);

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
        if (this.fighting.hasLoot) {
          console.log(`${this.fighting.name} drops ${this.fighting.loot.name}`);
          this.curRoom.loot.push(this.fighting.loot);
        }
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

  runAway(cb) {
    // Check to see of the monster stops us.
    if (Util.hitCheck(this.fighting.speed, this.speed)) {
      console.log("The monster stopped you!!!");
      this.monsterAttack(cb);
    } else {
      console.log("You escaped!!!");
      this.inFight = false;
      this.fighting = null;
      this.curRoom = this.prevRoom;
    }
    cb();
  }

  goNorth() {
    if (this.curRoom.hasNorth()) {
      this.prevRoom = this.curRoom;
      this.curRoom = this.curRoom.directions.north;
      this.curRoom.describe();
      this.curRoom.visited = true;
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goSouth() {
    if (this.curRoom.hasSouth()) {
      this.prevRoom = this.curRoom;
      this.curRoom = this.curRoom.directions.south;
      this.curRoom.describe();
      this.curRoom.visited = true;
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goEast() {
    if (this.curRoom.hasEast()) {
      this.prevRoom = this.curRoom;
      this.curRoom = this.curRoom.directions.east;
      this.curRoom.describe();
      this.curRoom.visited = true;
      console.log("Current room object: ", this.curRoom.x, this.curRoom.y);
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goWest() {
    if (this.curRoom.hasWest) {
      this.prevRoom = this.curRoom;
      this.curRoom = this.curRoom.directions.west;
      this.curRoom.describe();
      this.curRoom.visited = true;
      console.log("Current room object: ", this.curRoom.x, this.curRoom.y);
    } else {
      console.log("You have hit your nose on a wall.  But why?");
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

        if (o != "any" && o != "hidden") {
          options += optionCt + ": ";
          curQuestion.answers[o].optionCt = optionCt;
        }

        if (o == "hidden") {
          curQuestion.answers[o].optionCt = optionCt;
        } else {
          options += o;
        }
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

  addLoot(loot, cb) {
    console.log("Loot is :", loot instanceof Armor);
    console.log(loot);
    if (loot instanceof Armor) {
      this.addArmor(loot, () => {});
    }

    if (loot instanceof Weapon) {
      this.addWeapon(loot, () => {});
    }

    this.updateStats();
    setTimeout(cb, 4000);
  }

  addWeapon(loot, cb) {
    if (!(loot instanceof Weapon)) {
      return;
    }
    console.log("Adding weapon item:", loot.name);
    let weaponType = loot.type;
    let typeCt = 0;
    let typePieces = [loot];
    let nonTypePieces = [];
    for (let i = 0; i < this.weapons.length; i++) {
      let curPiece = this.weapons[i];
      if (curPiece.type == loot.type) {
        typeCt++;
        typePieces.push(curPiece);
      } else {
        nonTypePieces.push(curPiece);
      }
    }

    if (typeCt + 1 > weaponType.max) {
      // Can't wear two helmets.
      console.log(`You have multiple ${weaponType.name} options selecting the best.`);

      // Find the one that is stronger.
      typePieces.sort((a,b) => {
        return b.damage - a.damage;
      });

      for (let i = weaponType.max; i < typePieces.length; i++) {
        console.log(`Moving ${typePieces[i].name} to your backpack.`);
        this.backpack.push(typePieces[i]);
      }
      typePieces.length = weaponType.max;
    }

    // Put all the weapon back in.
    this.weapons = [].concat(nonTypePieces).concat(typePieces);
    console.log("You are now equiped with:");
    for (let i = 0; i < this.weapons.length; i++) {
      console.log(`${this.weapons[i].name} and it provides ${this.weapons[i].damage} damage.`);
    }
  }


  addArmor(loot, cb) {
    if (!(loot instanceof Armor)) {
      return;
    }
    console.log("Adding armor item:", loot.name);
    let armorType = loot.type;
    let typeCt = 0;
    let typePieces = [loot];
    let nonTypePieces = [];
    for (let i = 0; i < this.armorPieces.length; i++) {
      let curPiece = this.armorPieces[i];
      if (curPiece.type == loot.type) {
        typeCt++;
        typePieces.push(curPiece);
      } else {
        nonTypePieces.push(curPiece);
      }
    }

    if (typeCt + 1 > armorType.max) {
      // Can't wear two helmets.
      console.log(`You have multiple ${armorType.name} options selecting the best.`);

      // Find the one that is stronger.
      typePieces.sort((a,b) => {
        return b.defense - a.defense;
      });

      for (let i = armorType.max; i < typePieces.length; i++) {
        console.log(`Moving ${typePieces[i].name} to your backpack.`);
        this.backpack.push(typePieces[i]);
      }
      typePieces.length = armorType.max;
    }

    // Put all the armor back in.
    this.armorPieces = [].concat(nonTypePieces).concat(typePieces);
    console.log("You are now wearing:");
    for (let i = 0; i < this.armorPieces.length; i++) {
      console.log(`${this.armorPieces[i].name} and it provides ${this.armorPieces[i].defense} defense.`);
    }
  }

  updateStats(cb) {
    let armor = this.baseArmor;
    for (let i = 0; i < this.armorPieces.length; i++) {
      let curArmor = this.armorPieces[i];
      armor += curArmor.defense;
    }
    this.armor = armor;
    if (cb) {
      cb();
    }
  }

  inspectBackpack(cb) {
    console.log(`Your backpack has:`);
    for (let i = 0; i < this.backpack.length; i++) {
      console.log(`${this.backpack[i].name}`);
    }

    if (cb) { 
      setTimeout(cb, 3000);
    }
  }
}

module.exports.Adventurer = Adventurer;
