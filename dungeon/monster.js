var Util = require('./util.js');
var Weapon = require('./weapon.js').Weapon;
var Armor = require('./armor.js').Armor;

class Monster {
  constructor(name, health, armor, strength, speed, lootClass, weapons) {
    this.name = name;
    this.health = health;
    this.armor = armor;
    this.strength = strength;
    this.speed = speed;
    this.lootClass = lootClass;
    this.weapons = weapons;
    this.hasLoot = false;
  }

  createRandom() {
    let whichMonster = Util.getRandomProp(Monster.monster_options);
    return this.create(whichMonster);
  }

  create(whichOption) {
    let monster = new Monster(
      whichOption.name,
      whichOption.health,
      whichOption.armor,
      whichOption.strength,
      whichOption.speed,
      whichOption.lootClass,
      whichOption.weapons
    );

    let hasLoot = (Math.random() * 100 > 20);
    if (true) {
      monster.hasLoot = true;
      let lootItemOption = Util.getRandom(Monster.lootClass[monster.lootClass]);
      let loot = new Armor().create(lootItemOption);
      monster.loot = loot;
    }

    return monster;
  }
}

Monster.lootClass = {
  "junk" : [
    Armor.options.snot_helm,
    Armor.options.snot_jerkin,
    Armor.options.snot_pants,
    Armor.options.snot_gloves,
    Armor.options.snot_boots,
  ],
  "low" : [
    Armor.options.leather_helm,
    Armor.options.leather_jerkin,
    Armor.options.leather_pants,
    Armor.options.leather_gloves,
    Armor.options.leather_boots,
  ],
  "mid" : [
    Armor.options.iron_helm,
    Armor.options.iron_chestplate,
    Armor.options.iron_pants,
    Armor.options.iron_gauntlets,
    Armor.options.iron_boots,
  ],
  "high" : [
    Armor.options.demonic_helm,
    Armor.options.demonic_pants,
    Armor.options.demonic_gauntlets,
  ],
  "rare" : [
    Armor.options.demonic_helm,
    Armor.options.demonic_chestplate,
    Armor.options.demonic_pants,
    Armor.options.demonic_gauntlets,
    Armor.options.demonic_boots,
  ],
  "exceptional" : [
  ],
  "oneofakind" : [
  ],
}

Monster.monster_options = {
  slime : {
    name:"slime",
    health: 2,
    armor : 1,
    strength : 1,
    speed : 1,
    manaPerTurn : 0,
    lootClass: "junk",
    weapons : [new Weapon("snot", "acid", "-", "-", null, 1)]
  },
  giant_slime : {
    name:"giant slime",
    health: 5,
    armor : 3,
    strength : 3,
    speed : 1,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : [new Weapon("heavy snot", "acid", "-", "-", null, 3)]
  },
  slime_swarm: {
    name:"slime swarm",
    health: 5,
    armor : 1,
    strength : 1,
    speed : 4,
    manaPerTurn : 0,
    lootClass: "junk",
    weapons : [new Weapon("snot storm", "acid", "-", "-", null, 1)]
  },
  skeleton: {
    name:"skeleton",
    health: 3,
    armor : 2,
    strength : 2,
    speed : 2,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : [new Weapon("rusty sword", "stabby", "rusty sword", "", null, 2)]
  },
  zombie: {
    name:"zombie",
    health: 5,
    armor : 2,
    strength: 4,
    speed: 1,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : [new Weapon("claws", "claws", "-", "-", null, 4)]
  },
  giant_spider: {
    name:"giant spider",
    health: 5,
    armor : 1,
    strength: 3,
    speed: 2,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : [new Weapon("poisonous fangs", "poison", "-", "-", null, 3)]
  },
  mimic: {
    name:"chest",
    health: 5,
    armor : 4,
    strength: 6,
    speed: 2,
    manaPerTurn : 0,
    lootClass: "high",
    weapons : [new Weapon("teeth", "teeth", "-", "-", null, 5)]
  },
  demon: {
    name:"demon",
    health: 15,
    armor : 10,
    strength: 6,
    speed: 3,
    manaPerTurn : 1,
    lootClass: "rare",
    weapons : [new Weapon("teeth", "teeth", "-", "-", null, 4), new Weapon("claws", "claws", "claws", "", null, 6), new Weapon("whip", "whip", "", "whip", null, 9)]
  },
  troll: {
    name:"troll",
    health: 20,
    armor : 10,
    strength: 10,
    speed: 1,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : [new Weapon("massive cudgle", "blunt", "-", "-", null, 9)]
  },
  bog_stomper: {
    name:"bog stomper",
    health: 10,
    armor : 8,
    strength: 6,
    speed: 3,
    manaPerTurn : 0,
    mana : 40,
    lootClass: "mid",
    weapon: [new Weapon("ranced breath", "poison", "-", "-", null, 6),new Weapon("big feet", "stompy", "-", "-", null, 4)]
  },
}

module.exports.Monster = Monster;
