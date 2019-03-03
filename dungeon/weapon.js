
class WeaponParts {
  constructor() {
    this.leftHand = null;
    this.rightHand = null;
    this.quiver = null;
    this.health = 10;
    this.hasMagic = false;
    this.buffs = null;
  }
}

class Weapon {
  constructor(name, type, left, right, quiver, damage, buffs) {
    this.name = name;
    this.type = type;
    this.damage = damage;
    this.buffs = [];
    this.parts = new WeaponParts();
    this.parts.leftHand = left;
    this.parts.rightHand = right;
    this.parts.quiver = quiver;
    this.max = 1;
  }

  describe() {
    let desc = "";
    if (this.parts.leftHand == "-") {
        desc += "In your hands you have a " + this.name;
    } else {
      if (this.parts.leftHand) {
        desc += "In your left hand you have " + this.parts.leftHand;
      }
      if (this.parts.rightHand) {
        desc += "\nIn your right hand you have " + this.parts.rightHand;
      }
      if (this.parts.quiver) {
        desc += "In your quiver you have " + this.parts.quiver;
      }
    }

    console.log(desc);
  }

  static createRandom() {
    let whichWeapon = Util.getRandomProp(Weapon.options);
    return Weapon.create(whichWeapon);
  }

  static create(whichOption) {
    let weapon = new Weapon(
      whichOption.name,
      whichOption.type,
      whichOption.parts.leftHand,
      whichOption.parts.rightHand,
      whichOption.parts.quiver,
      whichOption.damage,
    );
    return weapon;
  }
}

Weapon.options = {
  snot_whip: new Weapon("snot whip", "acid", "-", "-", null, 2),
  rusty_dagger: new Weapon("dagger", "slashing", "-", "-", null, 2),
  bucket: new Weapon("bucket", "blunt", "-", "-", null, 2),
  really_rusty_sword: new Weapon("really rusty sword", "blunt", "-", "-", null, 2),
  spiked_club: new Weapon("spiked club", "blunt", "-", "-", null, 3),
  bow: new Weapon("bow", "bow", "-", "-", 30, 2),
  axe: new Weapon("axe", "slashing", "-", "-", null, 3),
  heavy_axe: new Weapon("heavy axe", "slashing", "-", "-", null, 4),
  great_axe: new Weapon("great axe", "slashing", "-", "-", null, 5),
  short_sword: new Weapon("short sword", "stabby", "", "short sword", null, 3),
  sword: new Weapon("sword", "stabby", "", "sword", null, 4),
  long_sword: new Weapon("long sword", "stabby", "", "long sword", null, 5),
  extremely_stale_fruitcake: new Weapon("extremely stale fruitcake", "blunt", "-", "-", null, 2),
  rock: new Weapon("rock", "blunt", "-", "-", null, 2),
  massive_cudgle: new Weapon("massive cudgle", "blunt", "-", "-", null, 6),
  massive_rock: new Weapon("massive cudgle", "blunt", "-", "-", null, 6),
  fiery_longsword: new Weapon("fiery logsword", "slashing", "-", "-", null, 8),
  demonclaw_dagger: new Weapon("demonclaw dagger", "stabby", "-", "-", null, 9),
  cultist_dagger: new Weapon("cultist dagger", "stabby", "-", "-", null, 5, {"speed":3}),
  cultist_sword: new Weapon("cultist sword", "stabby", "-", "-", null, 5, {"speed":5}),
}

module.exports.Weapon = Weapon
