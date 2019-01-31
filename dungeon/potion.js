var Util = require('./util.js');
var Spell = require('./spells.js').Spell;

class Potion extends Spell {
  constructor(name, type, effect, focus) {
    super(name, type, effect, 0, focus);
    this.charges = 1;
  }

  describe() {
    let desc = "";
    let targets = this.getTarget();
    desc = `${this.name} is a ${this.type} of potion.  It does ${this.effect} on ${targets}`;

    console.log(desc);
  }
}

Potion.types = Spell.types;

class Scroll extends Potion {
  constructor(name, type, effect, focus, charges) {
    super(name, type, effect, focus);
    this.charges = charges;
  }

  describe() {
    let desc = "";
    let targets = this.getTarget();
    desc = `${this.name} is a ${this.type} of scroll.  It does ${this.effect} on ${targets}`;

    console.log(desc);
  }
}

module.exports.Potion = Potion;
module.exports.Scroll = Scroll;
