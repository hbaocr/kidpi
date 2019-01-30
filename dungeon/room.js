var Util = require('./util.js');
var Monster = require('./monster.js').Monster;
console.log("Room.js loaded.");

class Room {
  constructor() {
    this.name= "unset";
    this.type = "unset";
    this.treasures = [];
    this.monsters = [];
    this.stuff = [];
    this.mana = 0;
    this.traps = [];
    this.directions = {
      east: null,
      west: null,
      north: null,
      south: null,
      down: null,
      up: null,
    }
    this.attributes = [
    ];
  }

  randomize() {
    this.name = Math.floor(Math.random() * 1000000);
    this.monsters.push((new Monster()).createRandom());
    this.attributes.push(Util.getRandom(Room.attrs));
    this.stuff.push(Util.getRandomProp(Room.stuff_options));
    this.mana = 10 + Math.floor(Math.random() * 10);
  }

  hasNorth() {
    return this.directions.north != null;
  }

  hasSouth() {
    return this.directions.south != null;
  }

  hasEast() {
    return this.directions.east != null;
  }

  hasWest() {
    return this.directions.west != null;
  }

  hasUp() {
    return this.directions.up != null;
  }

  hasDown() {
    return this.directions.down != null;
  }

  hasMonster() {
    return this.monsters.length != 0;
  }

  describe() {
    let desc = "The room is " + this.attributes[0].attr;
    if (this.monsters.length) {
      desc += " it has a " + this.monsters[0].name;
    }

    if (this.stuff.length) {
      desc += " and you can see " + this.stuff[0];
    }

    console.log(desc);
    for (var dir in this.directions) {
      if (this.directions[dir]) {
        console.log("It has a door to the", dir);
      }
    }
  }
}

Room.stuff_options = {
  shelf: "shelf",
  chest: "chest",
  bed: "bed",
  statue: "statue",
  pool: "pool",
  mushrooms: "mushrooms",
  stalagtites: "stalagtites"
}


Room.attrs = [
  {attr: "wet", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["dry"]},
  {attr: "cold", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.bed,
  ], notattrs:["hot", "humid"]},
  {attr: "slimy", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["dry"]},
  {attr: "dark", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
    Room.stuff_options.bed,
  ], notattrs:["bright"]},
  {attr: "humid", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["dry","cold"]},
  {attr: "hot", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["cold"]},
  {attr: "bright", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["dark", "cavelike"]},
  {attr: "cavelike", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["bright"]},
  {attr: "dry", stuff: [
    Room.stuff_options.shelf,
    Room.stuff_options.chest,
    Room.stuff_options.statue,
    Room.stuff_options.pool,
    Room.stuff_options.mushrooms,
  ], notattrs:["wet","slimy"]},
]


module.exports.Room = Room;
