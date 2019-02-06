var Util = require('./util.js');
var Spell = require('./spells.js').Spell;

class Scroll extends Spell {
  constructor(name, type, effect, manaCost, focus, charges) {
    super(name, type, effect, manaCost, focus);
    this.charges = charges;
  }

  describe() {
    let desc = "";
    let targets = this.getTarget();
    desc = `${this.name} is a ${this.type} of scroll.  It does ${this.effect} on ${targets}`;

    console.log(desc);
  }

  create(whichOption) {
    let scroll = new Scroll (
      whichOption.name,
      whichOption.type,
      whichOption.effect,
      whichOption.mana,
      whichOption.focus,
      whichOption.charges,
    );
    return scroll;
  }
}

Scroll.options = {
  snot_storm: new Scroll("Snot Storm", Spell.types.damaging, 2, 5, 9, 5),
  vaporize: new Scroll("Vaporize", Spell.types.damaging, 25, 50, 9, 1),
  fireball: new Scroll("Fireball", Spell.types.damaging, 3, 7, 5, 3),
}

class Potion extends Scroll {
  constructor(name, type, effect, manaCost, focus) {
    super(name, type, effect, manaCost, focus, 1);
  }

  describe() {
    let desc = "";
    let targets = this.getTarget();
    desc = `${this.name} is a ${this.type} of potion.  It does ${this.effect} on ${targets}`;

    console.log(desc);
  }

  create(whichOption) {
    let potion = new Potion(
      whichOption.name,
      whichOption.type,
      whichOption.effect,
      whichOption.mana,
      whichOption.focus,
    );
    return potion;
  }
}

Potion.types = Spell.types;

Potion.options = {
  freeze: new Potion("Freeze", Spell.types.damaging, 2, 5, 9),
  mutate: new Potion("Mutate", Spell.types.damaging, 20, 50, 10),
  blue_heal: new Potion("blue heal", Spell.types.healing, 5, 40, 10),
  pink_heal: new Potion("pink heal", Spell.types.healing, 10, 70, 10),
  red_heal: new Potion("red heal", Spell.types.healing, 20, 90, 10),
}

module.exports.Potion = Potion;
module.exports.Scroll = Scroll;
