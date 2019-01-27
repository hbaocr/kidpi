
class WeaponParts {
  constructor() {
    this.leftHand = null;
    this.rightHand = null;
    this.quiver = null;
    this.health = 10;
    this.hasMagic = false;
    this.buff = null;
  }
}

class Weapon {
  constructor(name, type, left, right, quiver, damage) {
    this.name = name;
    this.type = type;
    this.damage = damage;
    this.parts = new WeaponParts();
    this.parts.leftHand = left;
    this.parts.rightHand = right;
    this.parts.quiver = quiver;
  }

  describe() {
    let desc = "";
    if (this.parts.leftHand) {
      desc += "In your left hand you have " + this.parts.leftHand;
    }
    if (this.parts.rightHand) {
      desc += "\nIn your right hand you have " + this.parts.rightHand;
    }
    if (this.parts.quiver) {
      desc += "In your quiver you have " + this.parts.quiver;
    }

    console.log(desc);
  }
}

module.exports.Weapon = Weapon;
