var Util = require('./util.js');
var Weapon = require('./weapon.js').Weapon;

class Monster {
}

Monster.lootClass = {
  "junk" : [
  ],
  "low" : [
  ],
  "mid" : [
  ],
  "high" : [
  ],
  "rare" : [
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
    lootClass: "exceptional",
    weapons : [new Weapon("teeth", "teeth", "-", "-", null, 4), new Weapon("claws", "claws", "claws", "", null, 6), new Weapon("whip", "whip", "", "whip", null, 9)]
  },
}

module.exports.Monster = Monster;
