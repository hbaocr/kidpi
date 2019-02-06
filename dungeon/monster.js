var Util = require('./util.js');
var Weapon = require('./weapon.js').Weapon;
var Armor = require('./armor.js').Armor;
var Scroll = require('./potion.js').Scroll;
var Potion = require('./potion.js').Potion;

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
      let loot = null;
      if (lootItemOption instanceof Armor) {
        loot = new Armor().create(lootItemOption);
      } else if (lootItemOption instanceof Weapon) {
        loot = new Weapon().create(lootItemOption);
      } else if (lootItemOption instanceof Scroll) {
        loot = new Scroll().create(lootItemOption);
      }

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
    Weapon.options.snot_whip,
    Weapon.options.rusty_dagger,
    Weapon.options.bucket,
    Weapon.options.rock,
    Weapon.options.really_rusty_sword,
    Scroll.options.snot_storm,
    Scroll.options.snot_storm,
    Scroll.options.snot_storm,
    Scroll.options.snot_storm,
  ],
  "low" : [
    Armor.options.leather_helm,
    Armor.options.leather_jerkin,
    Armor.options.leather_pants,
    Armor.options.leather_gloves,
    Armor.options.leather_boots,
    Armor.options.leather_helm,
    Armor.options.leather_jerkin,
    Armor.options.leather_pants,
    Armor.options.leather_gloves,
    Armor.options.leather_boots,
    Armor.options.leather_helm,
    Armor.options.leather_jerkin,
    Armor.options.leather_pants,
    Armor.options.leather_gloves,
    Armor.options.leather_boots,
    Weapon.options.really_rusty_sword,
    Weapon.options.rusty_dagger,
    Weapon.options.spiked_club,
    Weapon.options.axe,
    Weapon.options.short_sword,
    Armor.options.leather_boots,
    Armor.options.leather_boots,
    Weapon.options.really_rusty_sword,
    Weapon.options.rusty_dagger,
    Weapon.options.spiked_club,
    Weapon.options.axe,
    Weapon.options.short_sword,
    Weapon.options.really_rusty_sword,
    Weapon.options.rusty_dagger,
    Weapon.options.spiked_club,
    Weapon.options.axe,
    Weapon.options.short_sword,
    Weapon.options.extremely_stale_fruitcake,
    Scroll.options.snot_storm,
    Potion.options.freeze,
    Scroll.options.snot_storm,
    Potion.options.freeze,
    Scroll.options.snot_storm,
    Potion.options.freeze,
    Scroll.options.snot_storm,
    Potion.options.freeze,
    Potion.options.blue_heal,
    Potion.options.blue_heal,
    Potion.options.blue_heal,
    Potion.options.blue_heal,
  ],
  "mid" : [
    Armor.options.iron_helm,
    Armor.options.iron_chestplate,
    Armor.options.iron_pants,
    Armor.options.iron_gauntlets,
    Armor.options.iron_boots,
    Weapon.options.heavy_axe,
    Weapon.options.sword,
    Weapon.options.great_axe,
    Weapon.options.bow,
    Scroll.options.fireball,
    Scroll.options.fireball,
    Scroll.options.fireball,
    Scroll.options.fireball,
    Scroll.options.fireball,
    Scroll.options.fireball,
    Potion.options.blue_heal,
    Potion.options.blue_heal,
    Potion.options.blue_heal,
    Potion.options.blue_heal,
    Potion.options.pink_heal,
    Potion.options.pink_heal,
    Potion.options.pink_heal,
    Potion.options.pink_heal,
  ],
  "high" : [
    Armor.options.demonic_helm,
    Armor.options.demonic_pants,
    Armor.options.demonic_gauntlets,
    Weapon.options.great_axe,
    Weapon.options.long_sword,
    Weapon.options.massive_cudgle,
    Weapon.options.massive_rock,
    Potion.options.freeze,
    Potion.options.freeze,
    Potion.options.freeze,
    Potion.options.freeze,
    Potion.options.freeze,
    Potion.options.freeze,
    Potion.options.red_heal,
    Potion.options.red_heal,
    Potion.options.red_heal,
    Potion.options.red_heal,
    Scroll.options.vaporize,
  ],
  "rare" : [
    Armor.options.demonic_helm,
    Armor.options.demonic_chestplate,
    Armor.options.demonic_pants,
    Armor.options.demonic_gauntlets,
    Armor.options.demonic_boots,
    Weapon.options.fiery_longsword,
    Weapon.options.demonclaw_dagger,
    Potion.options.freeze,
    Potion.options.freeze,
    Potion.options.freeze,
    Potion.options.freeze,
    Potion.options.freeze,
    Potion.options.red_heal,
    Potion.options.red_heal,
    Potion.options.red_heal,
    Potion.options.red_heal,
    Potion.options.red_heal,
    Potion.options.red_heal,
    Potion.options.red_heal,
    Potion.options.red_heal,
    Scroll.options.vaporize,
    Scroll.options.vaporize,
  ],
  "exceptional" : [
    Scroll.options.vaporize,
    Scroll.options.vaporize,
    Scroll.options.vaporize,
    Scroll.options.vaporize,
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
  goblin: {
    name:"goblin",
    health: 3,
    armor : 1,
    strength: 2,
    speed: 2,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : [new Weapon("shiv", "stabby", "-", "-", null, 3)]
  },
  wraith: {
    name:"wraith",
    health: 3,
    armor : 1,
    strength: 5,
    speed: 6,
    manaPerTurn : 0,
    lootClass: "high",
    weapons : [new Weapon("ghostly claws", "staby", "-", "-", null, 3)]
  },
  stone_golem: {
    name:"stone golem",
    health: 20,
    armor :15 ,
    strength: 5,
    speed: 1,
    manaPerTurn : 0,
    lootClass: "rare",
    weapons : [new Weapon("giant fists", "blunt", "-", "-", null, 4)]
  },
  demon: {
    name:"demon",
    health: 15,
    armor : 10,
    strength: 6,
    speed: 4,
    manaPerTurn : 1,
    lootClass: "rare",
    weapons : [new Weapon("teeth", "teeth", "-", "-", null, 4), new Weapon("claws", "claws", "claws", "", null, 6), new Weapon("whip", "whip", "", "whip", null, 9)]
  },
  fire_elemental: {
    name:"fire elemental",
    health: 6,
    armor : 2,
    strength: 3,
    speed: 7,
    manaPerTurn : 0,
    lootClass: "high",
    weapons : [new Weapon("flaming arms", "burny", "-", "-", null, 5)]
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
    weapons: [new Weapon("ranced breath", "poison", "-", "-", null, 6),new Weapon("big feet", "stompy", "-", "-", null, 4)]
  },
}

module.exports.Monster = Monster;
