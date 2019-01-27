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
    this.monsters.push(Util.getRandomProp(Monster.monster_options));
    this.attributes.push(Util.getRandom(Room.attrs));
    this.stuff.push(Util.getRandomProp(Room.stuff_options));
  }

  describe() {
    console.log("The room is: ", this.attributes[0].attr, " it has a ", this.monsters[0], " and you can see ", this.stuff[0]);
    for (var dir in this.directions) {
      if (this.directions[dir]) {
        console.log("You can go: ", dir);
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
