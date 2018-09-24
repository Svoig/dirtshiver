const readline = require("readline");
const lingua = require("./lingua");
const util = require("./util");
const initialGameState = require("./gameState");
const Character = require("./character").Character;
const world = require("./world");
const interaction = require("./interaction");
const items = require("./items");

// TODO: Custom console logging. newlines and colors maybe

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const gameState = Object.assign({}, initialGameState);

console.log("~~~~ Welcome to the game ~~~~");

gameState.worldName = util.capitalizeWord(lingua.word(2));

gameState.map = world.createMap(gameState.worldName);

gameState.inventory.push(util.randomFromArray(1, items));

console.log(
  `You awaken in a strange land. You search around for signs of civilization and see a sign:  City of ${
    gameState.worldName
  } ahead.`
);

gameState.scene = world.getSceneForTile(gameState.map, 0, 0);

function gameLoop() {
  if (!gameState.scene.didIntro) {
    gameState.scene.intro();
    gameState.scene.didIntro = true;
  }

  return rl.question("What do you do?\n> ", processInput);
}

function processInput(input) {
  // TODO: handle mulit-word inputs
  // const commands = input.split(' ');

  switch (input.toLowerCase()) {
    case interaction.TALK:
      gameState.scene.npc.talk();
      break;
    case interaction.INVENTORY:
      console.log("Your inventory contains:\n");
      gameState.inventory.forEach(item => {
        console.log(`- ${item}`);
      });
      console.log("\n");
      break;
    case interaction.GIVE:
      // TODO: Let player decide what to give
      // TODO: Give items IDs to match against instead of just strings
      handleGive();
      break;
    case interaction.LOOK:
      const hasLoot = !!gameState.scene.loot;
      const lootIsArray =
        Array.isArray(gameState.scene.loot) && gameState.scene.loot.length > 0;
      const lootIsSingle = hasLoot && !lootIsArray;
      console.log(`You look around ${gameState.scene.name}...`);

      if (hasLoot && (lootIsArray || lootIsSingle)) {
        // TODO: Give player option of not taking the item
        // TODO: Fix player-facing formatting (no square brackets)
        console.log(`You see something of interest! ${gameState.scene.loot}.`);
        handleTake(gameState.scene.loot);
      }

      if (gameState.scene.npc) {
        console.log(`You see someone nearby.`);
      }

      if (!gameState.scene.npc && !hasLoot) {
        console.log("You don't see anything interesting.");
      }
  }
  return gameLoop();
}

function handleTake(loot) {
  // TODO: Make sure we always get an array so we don't have to do this
  const items = [loot];
  rl.question("What would you like to take?\n> ", target => {
    switch (target.toLowerCase()) {
      case "all":
        console.log("You grab everything in sight!");
        if (Array.isArray(gameState.scene.loot)) {
          gameState.scene.loot.forEach(item => gameState.inventory.push(item));
        } else {
          // TODO: Make loot always an array so we don't have to do this
          gameState.inventory.push(gameState.scene.loot);
        }
        return gameLoop();
        break;
      case items[0]:
        console.log(`You take the ${items[0]}`);
        if (Array.isArray(gameState.scene.loot)) {
          gameState.scene.loot.splice(
            gameState.scene.loot.indexOf(items[0], 1)
          );
        } else {
          gameState.scene.loot = [];
        }
        gameState.inventory.push(items[0]);
        break;
      default:
        break;
    }
  });
  return gameLoop();
}

function handleGive() {
  if (!gameState.inventory.length) {
    console.log("You don't have anything to give!");
    return gameLoop();
  }

  rl.question("What would you like to give?\n> ", givenItem => {
    console.log(`You offer the ${givenItem}...`);
    if (
      gameState.scene.npc.desiredItem.toLowerCase() === givenItem.toLowerCase()
    ) {
      gameState.inventory.splice(gameState.inventory.indexOf(givenItem), 1);
      gameState.scene.npc.inventory.push(givenItem);
      gameState.scene.npc.desiredItem = undefined;
      gameState.scene.npc.talk("Thank you!");
      // TODO: gameState.scene.npc.mood++;
    } else {
      gameState.scene.npc.talk("I don't want that!");
    }
    return gameLoop();
  });
}

gameLoop();
