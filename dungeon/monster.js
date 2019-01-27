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
    weapons : { name: "snot", parts: ["snot"]},
  },
  giant_slime : {
    name:"giant slime",
    health: 5,
    armor : 3,
    strength : 3,
    speed : 1,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : { name: "heavy snot", parts: ["heavy snot"]},
  },
  slime_swarm: {
    name:"slime swarm",
    health: 5,
    armor : 1,
    strength : 1,
    speed : 4,
    manaPerTurn : 0,
    lootClass: "junk",
    weapons : { name: "snot storm", parts: ["snot storm"]},
  },
  skeleton: {
    name:"skeleton",
    health: 3,
    armor : 2,
    strength : 2,
    speed : 2,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : { name: "rusty sword", parts: ["rusty sword"]},
  },
  zombie: {
    name:"zombie",
    health: 5,
    armor : 2,
    strength: 4,
    speed: 1,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : { name: "claws", parts: ["claws"]},
  },
  giant_spider: {
    name:"giant spider",
    health: 5,
    armor : 1,
    strength: 3,
    speed: 2,
    manaPerTurn : 0,
    lootClass: "low",
    weapons : { name: "poisonous fangs", parts: ["poisonous fangs"]},
  },
  mimic: {
    name:"chest",
    health: 5,
    armor : 4,
    strength: 6,
    speed: 2,
    manaPerTurn : 0,
    lootClass: "high",
    weapons : { name: "teeth", parts: ["teeth"]},
  },
  demon: {
    name:"demon",
    health: 15,
    armor : 10,
    strength: 6,
    speed: 3,
    manaPerTurn : 1,
    lootClass: "exceptional",
    weapons : { name: "teeth", parts: ["teeth"]},
  },
}

module.exports.Monster = Monster;
