var Util = require('./util.js');
var Spell = require('./spells.js').Spell;

class Scroll extends Spell {
  constructor(name, type, effect, manaCost, focus, charges) {
    super(name, type, effect, manaCost, focus);
    this.charges = charges;
  }

  description() {
    let desc = "";
    let targets = this.getTarget();
    desc = `${this.name} is a ${this.type} scroll.  It does ${this.effect} on ${targets}`;
    return desc;
  }

  describe() {
    console.log(this.description());
  }

  static create(whichOption) {
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
  rainbow_swirl: new Scroll("Rainbow Swirl", Spell.types.damaging, 5, 12, 8, 4),
}

class Potion extends Scroll {
  constructor(name, type, effect, focus, buffs) {
    super(name, type, effect, 1, focus, 1);
    this.isPotion = true;
    this.buffs = buffs;
  }

  description() {
    let desc = "";
    let targets = this.getTarget();
    desc = `${this.name} is a ${this.type} potion.  It does ${this.effect} on ${targets}`;
    return desc;
  }

  describe() {
    console.log(this.description());
  }

  static create(whichOption) {
    let potion = new Potion(
      whichOption.name,
      whichOption.type,
      whichOption.effect,
      whichOption.focus,
      whichOption.buffs,
    );
    return potion;
  }
}

Potion.types = Spell.types;

Potion.options = {
  freeze: new Potion("Freeze", Spell.types.damaging, 4, 10),
  mutate: new Potion("Mutate", Spell.types.damaging, 20, 10),
  blue_heal: new Potion("blue heal", Spell.types.healing, 5, 10),
  pink_heal: new Potion("pink heal", Spell.types.healing, 10,10),
  red_heal: new Potion("red heal", Spell.types.healing, 20,10),
  good_scotch: new Potion("good scotch", Spell.types.buffing, 10,10, {"strength":3,"speed":2, duration:Spell.durations.life}),
  the_flash: new Potion("the flash", Spell.types.buffing, 10,10, {"speed":3, duration:Spell.durations.life}),
}

class Food extends Potion {
  constructor(name, type, effect, focus, buffs) {
    super(name, type, effect, focus, buffs);
    this.isPotion = true;
    this.buffs = buffs;
  }

  description() {
    let desc = "";
    desc = `${this.name} is a ${this.type} food.  It heals ${this.effect} health`;
    return desc;
  }

  describe() {
    console.log(this.description());
  }

  static create(whichOption) {
    let food = new Food(
      whichOption.name,
      whichOption.type,
      whichOption.effect,
      whichOption.focus,
      whichOption.buffs,
    );
    return food;
  }
}

Food.types = Spell.types;

Food.options = {
  crab_meat: new Food("crab meat", Spell.types.healing, 2,10),
  turkey_leg: new Food("crab meat", Spell.types.healing, 2,10),
  good_scotch: new Food("good scotch", Spell.types.buffing, 10,10, {"strength":3,"speed":2, duration:Spell.durations.life}),
}

module.exports.Food = Food;
module.exports.Potion = Potion;
module.exports.Scroll = Scroll;
