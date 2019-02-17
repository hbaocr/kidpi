class Armor {
  constructor(name, type, defense) {
    this.name = name;
    this.type = type;
    this.defense = defense;
  }

  describe() {
  }

  static createRandom() {
    let whichArmor = Util.getRandomProp(Armor.options);
    return Armor.create(whichArmor);
  }

  static create(whichOption) {
    let armor = new Armor (
      whichOption.name,
      whichOption.type,
      whichOption.defense
    );
    return armor;
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
  ring: {name: "ring", max: 2},
}

Armor.options = {
  snot_helm: new Armor("snot helm", Armor.armor_type.helmet, 1),
  snot_jerkin: new Armor("snot jerkin", Armor.armor_type.chest, 1),
  snot_pants: new Armor("snot pants", Armor.armor_type.pants, 1),
  snot_gloves: new Armor("snot gloves", Armor.armor_type.hands, 1),
  snot_boots: new Armor("snot boots", Armor.armor_type.boots, 1),
  leather_helm: new Armor("leather helm", Armor.armor_type.helmet, 2),
  leather_jerkin: new Armor("leather jerkin", Armor.armor_type.chest, 2),
  leather_pants: new Armor("leather pants", Armor.armor_type.pants, 2),
  leather_gloves: new Armor("leather gloves", Armor.armor_type.hands, 2),
  leather_boots: new Armor("leather boots", Armor.armor_type.boots, 2),
  iron_helm: new Armor("iron helm", Armor.armor_type.helmet, 3),
  iron_chestplate: new Armor("iron chestplate", Armor.armor_type.chest, 4),
  iron_pants: new Armor("iron pants", Armor.armor_type.pants, 3),
  iron_gauntlets: new Armor("iron gauntlets", Armor.armor_type.hands, 3),
  iron_boots: new Armor("iron boots", Armor.armor_type.boots, 3),
  demonic_helm: new Armor("demonic helm", Armor.armor_type.helmet, 4),
  demonic_chestplate: new Armor("demonic chestplate", Armor.armor_type.chest, 7),
  demonic_pants: new Armor("demonic pants", Armor.armor_type.pants, 1),
  demonic_gauntlets: new Armor("demonic gauntlets", Armor.armor_type.hands, 3),
  demonic_boots: new Armor("demonic boots", Armor.armor_type.boots, 4),
}

module.exports.Armor = Armor;
