const readline = require('readline');
const fs = require('fs');

readline.emitKeypressEvents(process.stdin);
let saveCollection = {};
let game = {};
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 's') {
    console.log("Save!");
    console.log("Saving out", saveCollection);
    fs.writeFile("savedgame.json", JSON.stringify(saveCollection), (err) => {
      if (err) { console.log("Error in save: ", err); }
      else {
        console.log("Saved game.");
      }
    });
  } else if (key.ctrl && key.name === 'l') {
    fs.readFile("savedgame.json", (err, data) => {
      if (err) { console.log("Error in load: ", err); }
      else {
        let saveGame = JSON.parse(data);
        for (let prop in saveGame) {
          game[prop] = saveGame[prop];
        }
      }
    });
  }
});

function registerSaveObject(property, gameRef) {
  game = gameRef;
  saveCollection[property] = game[property];
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomProp(obj) {
  let keys = Object.keys(obj);
  let indexSelected = Math.floor(Math.random() * keys.length);
  let selection = obj[keys[indexSelected]];
  return selection;
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
  registerSaveObject: registerSaveObject,
  getRandomProp : getRandomProp,
  getRandom: getRandom,
  getOppositeDirection: getOppositeDirection,
  rl: rl,
  clear: clear,
  hitCheck: hitCheck,
}
