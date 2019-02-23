var Util = require('./util.js');
var Weapon = require('./weapon.js').Weapon;
var Spell = require('./spells.js').Spell;
var Armor = require('./armor.js').Armor;
var Scroll = require('./potion.js').Scroll;
var Potion = require('./potion.js').Potion;
var Food = require('./potion.js').Food;
var Room = require('./room.js').Room;
var Monster = require('./monster.js').Monster;

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
    this.food = [];
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
              this.strength = 3;
              this.speed = 5;
              this.mana = 0;
              this.weapons[0] = new Weapon("fists", "blunt", "-", "-", null, 1);
              this.weapons[1] = new Weapon("fists", "blunt", "-", "-", null, 1);
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
            /*
            "Archer": (value) => {
              this.type = value;
              this.armor = 2;
              this.baseArmor = 2;
              this.strength = 3;
              this.speed = 2;
              this.mana = 0;
              this.weapons[0] = new Weapon("fists", "blunt", "-", "-", null, 1);
              this.weapons[1] = new Weapon("fists", "blunt", "-", "-", null, 1);
              this.nextQuestion();
            },
            */
            "Fighter": (value) => {
              this.type = value;
              this.armor = 3;
              this.baseArmor = 2;
              this.strength = 4;
              this.speed = 3;
              this.mana = 0;
              this.weapons[0] = new Weapon("fists", "blunt", "-", "-", null, 1);
              this.weapons[1] = new Weapon("fists", "blunt", "-", "-", null, 1);
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
              this.weapons[1] = new Weapon("short sword", "stabby", "", "short sword", null, 1);
              this.spells[0] = Potion.create(Potion.options.good_scotch);
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
              this.spells[0] = new Spell("Timetear", Spell.types.damaging, 4, 3, 6);
              this.nextQuestion();
            },
            "Necromancer": () => {
              this.wizardType = "death",
              this.spells[0] = new Spell("Rot", Spell.types.damaging, 5, 3, 5);
              this.nextQuestion();
            },
          }
      },
    ];
  }

  playerAttack(spell, cb) {
    if (!spell) {
      for (let i = 0; i < this.weapons.length; i++) {
        console.log("\n\nYou swing with your " + this.weapons[0].name);
      }
    } else {
      console.log("\n\nYou cast " + spell.name);
    }

    // Check to see if we hit.
    setTimeout(() => {
      for (let i = 0; i < this.weapons.length; i++) {
        let strength = this.strength;
        let speed = (spell ? spell.focus : this.speed);
        if (this.weapons[0].buffs) {
          if (this.weapons[0].buffs["speed"]) {
            speed += this.weapons[0].buffs["speed"];
          } else if (this.weapons[1] && this.weapons[1].buffs["speed"]) {
            speed += this.weapons[0].buffs["speed"];
          }

          if (this.weapons[0].buffs["strength"]) {
            strength += this.weapons[0].buffs["strength"];
          } else if (this.weapons[1] && this.weapons[1].buffs["strength"]) {
            strength += this.weapons[0].buffs["strength"];
          }
        }

        if (Util.hitCheck(speed, this.fighting.speed)) {
          console.log("\n\n\nHit!!");
          let strengthMod = (Math.floor(Math.random() * strength));

          if (strengthMod <= 0) strengthMod = 1;

          let damage = this.weapons[i].damage * strengthMod;

          // Checking monsters armor.
          let armorSave = Math.floor(Math.random() * this.fighting.armor);
          if (spell) {
            damage = spell.effect;
            armorSave = 0;
          }

          console.log(`Damage before armor save: ${damage}, armor save: ${armorSave}`);
          damage = damage - armorSave;

          if (damage < 0) {
            damage = 0;
          }

          if (damage <= 0) {
            console.log("\nYour blow is deflected by the monsters armor!");
          } else {
            console.log("\nIt does " + damage + " damage to " + this.fighting.name);
          }

          this.fighting.health -= damage;
          console.log(this.fighting.name + " has " + this.fighting.health + " health left!");
        } else {
          console.log("\n\n\nOh no! You missed!!");
          console.log(this.fighting.name + " has " + this.fighting.health + " health left!");
        }
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
        this.fighting = null;
        setTimeout(() => { cb(); }, 3000);
      } else {
        setTimeout(() => {
          this.monsterAttack(cb);
        }, 1000);
      }
    });
  }

  buildFoodMenu(cb) {
    if (this.food.length > 1) {
      console.log("Which food would you like to eat?");
      for (let i = 0; i < this.food.length; i++) {
        console.log((i + 1) + ": " + this.food[i].description());
      }

      Util.rl.question('\n\n>>', (answer) => {
        let pickIndex = answer - 0;
        if (pickIndex >= this.food.length + 1) {
          console.log("You don't have that much food! Please try again.  Or enter 0 to cancel.");
          setTimeout(() =>  { this.buildFoodMenu(cb); }, 2000);
        } else if (answer == "0") {
          cb(null);
        } else {
          cb(this.food[pickIndex - 1]);
        }
      });
    } else {
      // If there is only one spell... just use it.
      cb(this.food[0]);
    }
  }

  eat(cb) {
    this.buildFoodMenu((food) => {
      if (food == null) {
        cb();
        return;
      }

      this.handleHealingSpell(food, cb)
      this.health += food.effect;
      console.log(`You have been healed for ${food.effect} health!`);
      for (let i = 0; i < this.food.length; i++) {
        if (this.food[i] == food) {
          this.food.splice(i,1);
        }
      }
      cb();
      return;
    });
  }

  buildSpellsMenu(cb) {
    let spellTypes = {};
    // Get each class of spells.
    for (let i = 0; i < this.spells.length; i++) {
      let curSpell = this.spells[i];
      if (!spellTypes[curSpell.type]) spellTypes[curSpell.type] = [];
      spellTypes[curSpell.type].push(curSpell);
    }

    // If there is man spells - we need to ask.
    if (this.curRoom.hasMonster()) {
      if (this.spells.length > 1) {
        console.log("Which spell, potion or scroll would you like to use?");
        for (let i = 0; i < this.spells.length; i++) {
          console.log((i + 1) + ": " + this.spells[i].description());
        }

        Util.rl.question('\n\n>>', (answer) => {
          let pickIndex = answer - 0;
          if (pickIndex >= this.spells.length + 1) {
            console.log("You don't have that many spells! Please try again.  Or enter 0 to cancel.");
            setTimeout(() =>  { this.buildSpellsMenu(cb); }, 2000);
          } else if (answer == "0") {
            cb(null);
          } else {
            cb(this.spells[pickIndex - 1]);
          }
        });
      } else {
        // If there is only one spell... just use it.
        cb(this.spells[0]);
      }
    } else {
      let spellsForMenu = [];
      if (spellTypes[Spell.types.healing])
        spellsForMenu = spellsForMenu.concat(spellTypes[Spell.types.healing]);
      if (spellTypes[Spell.types.revealing])
        spellsForMenu = spellsForMenu.concat(spellTypes[Spell.types.revealing]);
      if (spellTypes[Spell.types.enchanting])
        spellsForMenu = spellsForMenu.concat(spellTypes[Spell.types.enchanting]);
      if (spellTypes[Spell.types.buffing])
        spellsForMenu = spellsForMenu.concat(spellTypes[Spell.types.buffing]);

      if (spellsForMenu.length <= 0) {
        console.log("No spells to cast right now.");
        cb(null);
        return;
      }

      console.log("Which spell, potion or scroll would you like to use?");
      for (let i = 0; i < spellsForMenu.length; i++) {
        console.log((i + 1) + ": " + spellsForMenu[i].description());
      }

      Util.rl.question('\n\n>>', (answer) => {
        let pickIndex = answer - 0;
        if (pickIndex >= spellsForMenu.length + 1) {
          console.log("You don't have that many spells! Please try again.  Or enter 0 to cancel.");
          setTimeout(() =>  { this.buildSpellsMenu(cb); }, 2000);
        } else if (answer == "0") {
          cb(null);
        } else {
          cb(spellsForMenu[pickIndex - 1]);
        }
      });
    }
  }

  removeSpells() {
    let remainderSpells = [];
    for (let i = 0; i < this.spells.length; i++) {
      let spell = this.spells[i];
      if ( spell instanceof Scroll || spell instanceof Potion ) {
        if (this.spells[i].charges <= 0) {
          continue;
        } else {
          remainderSpells.push(this.spells[i]);
        }
      } else {
        remainderSpells.push(this.spells[i]);
      }
    }
    this.spells = remainderSpells;
  }

  spellUsedUpdate(spell) {
    if (spell instanceof Scroll || spell instanceof Potion) {
      spell.charges -= 1;
    }

    if (spell instanceof Scroll && !(spell.isPotion) && this.type == "wizard") {
      console.log("You have learned: ");
      spell.charges = 0;
      let newSpell = new Spell(spell.name, spell.type, spell.effect, spell.mana, spell.focus);
      newSpell.describe();
      this.spells.push(newSpell);
    }
    this.removeSpells();
  }

  cast(cb) {
    this.buildSpellsMenu((spell) => {
      if (spell == null) {
        cb();
        return;
      }

      if ( spell instanceof Scroll || spell instanceof Potion ) {
        if (spell.charges >= 1) {
          if (spell.isCombat()) {
            this.handleFightingSpell(spell, cb);
            return;
          } else if (spell.type == Spell.types.healing) {
            this.handleHealingSpell(spell, cb)
            return;
          } else if (spell.type == Spell.types.buffing) {
            this.handleBuffingSpell(spell, cb)
            return;
          }
        } else {
          consol.log("Charges check failed.  Can't happen.");
        }
      } else {
        if (this.mana > spell.mana) {
          this.mana -= spell.mana;
          if (spell.isCombat()) {
            this.fighting = this.curRoom.monsters[0];
            if (this.fighting) {
              this.inFight = true;
            }
            this.attack(cb, spell);
          }
          return;
        } else {
          console.log("You attempt to cast " + spell.name + " but fail.");
          if (spell.isCombat() && this.curRoom.hasMonster()) {
            this.fighting = this.curRoom.monsters[0];
            if (this.fighting) {
              this.inFight = true;
            }

            setTimeout(() => {
              this.monsterAttack(cb);
            }, 1000);
          }
          return;
        }
      }
    });
  }

  handleFightingSpell(spell, cb) {
    this.fighting = this.curRoom.monsters[0];
    if (this.fighting) {
      this.inFight = true;
      this.attack(() => {
        this.spellUsedUpdate(spell);
        cb();
      }, spell);
    } else {
      console.log("Not in fight.");
      cb();
    }
    return;
  }

  handleHealingSpell(spell, cb) {
    this.health += spell.effect;
    console.log(`You have been healed for ${spell.effect} health!`);
    this.spellUsedUpdate(spell);
    cb();
  }

  handleBuffingSpell(spell, cb) {
    for (let prop in spell.buffs) {
      if (prop == "duration") continue;
      this[prop] += spell.buffs[prop];
      console.log(`Your ${prop} been increased!`);
    }

    this.spellUsedUpdate(spell);
    setTimeout(() => {
      cb();
    }, 3000);
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

  enteredRoom() {
    this.curRoom.describe();
    this.curRoom.visited = true;
  }

  goNorth() {
    if (this.curRoom.hasNorth()) {
      this.prevRoom = this.curRoom;
      this.curRoom = this.curRoom.directions.north;
      this.enteredRoom();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goSouth() {
    if (this.curRoom.hasSouth()) {
      this.prevRoom = this.curRoom;
      this.curRoom = this.curRoom.directions.south;
      this.enteredRoom();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goEast() {
    if (this.curRoom.hasEast()) {
      this.prevRoom = this.curRoom;
      this.curRoom = this.curRoom.directions.east;
      this.enteredRoom();
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  goWest() {
    if (this.curRoom.hasWest) {
      this.prevRoom = this.curRoom;
      this.curRoom = this.curRoom.directions.west;
      this.enteredRoom();
      console.log("Current room object: ", this.curRoom.x, this.curRoom.y);
    } else {
      console.log("You have hit your nose on a wall.  But why?");
    }
  }

  lootChest(cb) {
    let lootClass = Monster.lootClass.alien;
    while(lootClass == Monster.lootClass.alien) {
      // This returns the collection of loot items as an array.
      lootClass = Util.getRandomProp(Monster.lootClass);
    }

    let loot = Util.getRandom(lootClass);

    for (let i = 0; i < this.curRoom.stuff.length; i++) {
      if (this.curRoom.stuff[i] == Room.stuff_options.chest) {
        this.curRoom.stuff.splice(i,1);
      }
    }

    console.log("Room now has: ", loot);
    this.curRoom.loot.push(Monster.createLoot(loot));
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

      Util.rl.question('\n '+curQuestion.q + " " + options + '\n>> ', (answer) => {
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
    if (loot instanceof Armor) {
      this.addArmor(loot, () => {});
    }

    if (loot instanceof Weapon) {
      this.addWeapon(loot, () => {});
    }

    if ((loot instanceof Scroll) || (loot instanceof Potion)) {
      console.log("You picked up: ");
      loot.describe();
      if (loot instanceof Food) {
        this.food.push(loot);
      } else {
        this.spells.push(loot);
      }
    }

    this.updateStats();
    setTimeout(cb, 4000);
  }

  addWeapon(loot, cb) {
    if (!(loot instanceof Weapon)) {
      return;
    }

    this.weapons.push(loot);

    console.log("Adding weapon item:", loot.name);

    // Can't use two weapons...
    console.log(`You have multiple weapon options...`);

    // Find the one that is stronger.
    this.weapons.sort((a,b) => {
      return b.damage - a.damage;
    });

    for (let i = this.weapons[0].max; i < this.weapons.length; i++) {
      console.log(`Moving ${this.weapons[i].name} to your backpack.`);
      this.backpack.push(this.weapons[i]);
    }

    this.weapons.length = this.weapons[0].max;

    // Put all the weapon back in.
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
