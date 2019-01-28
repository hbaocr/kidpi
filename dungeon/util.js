const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomProp(obj) {
  let keys = Object.keys(obj);
  return obj[keys[Math.floor(Math.random() * keys.length)]];
}

function getOppositeDirection(dir) {
  return {
    "east": "west",
    "west": "east",
    "north": "south",
    "south": "north" }[dir];
}

function clear() {
  console.log('\x1Bc');
}

function hitCheck(speedAttack, speedDefend) {
  let strike = Math.random() * (10 + speedAttack - speedDefend);
  return strike > 5;
}


module.exports = {
  getRandomProp : getRandomProp,
  getRandom: getRandom,
  getOppositeDirection: getOppositeDirection,
  rl: rl,
  clear: clear,
  hitCheck: hitCheck,
}
