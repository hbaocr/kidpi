class Spell{
  constructor(name, type, effect, manaCost, focus) {
    this.name = name;
    this.type = type;
    this.effect = effect;
    this.mana = manaCost;
    this.focus = focus; // Use this in speed attack checks.
  }

  getTarget() {
    let targets = "monsters";
    switch(this.type) {
      case "healing": targets = "you"; break;
      case "damaging": targets = "monsters"; break;
      case "revealing": targets = "room"; break;
      case "enchanting": targets = "equipment"; break;
      case "buffing": targets = "you"; break;
    }

    return targets;
  }

  describe() {
    let desc = "";
    let targets = this.getTarget();
    desc = `${this.name} is a ${this.type} of spell.  It does ${this.effect} on ${targets}`;

    console.log(desc);
  }
}

Spell.types = {
  "healing": "healing",
  "damaging": "damaging",
  "revealing": "revealing",
  "enchanting":"enchanting",
  "buffing": "buffing",
}

Spell.durations = {
  "battle":"battle",
  "life":"life",
}

module.exports.Spell = Spell;
