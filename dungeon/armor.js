
class Armor {
  constructor(name, type, defense) {
    this.name = name;
    this.type = type;
    this.defense = defense;
  }

  describe() {
  }
}

Armor.armor_type = {
  helmet: {name:"helmet", max: 1},
  chest: {name:"chest", max: 1},
  hands: {name:"hands", max: 1},
  boots: {name:"boots", max: 1},
  amulet: {name:"amulet", max: 3},
  belt: {name: "belt", max: 1},
  pants: {name: "pants", max: 1},
}

Armor.options = {
  leather_helm: new Armor("leather helm", Armor.armor_type.helmet, 1),
  leather_jerkin: new Armor("leather jerkin", Armor.armor_type.chest, 1),
  leather_pants: new Armor("leather pants", Armor.armor_type.pants, 1),
  leather_gloves: new Armor("leather gloves", Armor.armor_type.hands, 1),
  leather_boots: new Armor("leather boots", Armor.armor_type.boots, 1),
}

module.exports.Armor = Armor;
