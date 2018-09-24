const Character = require("./character").Character;
const lingua = require("./lingua");
const util = require("./util");
const items = require('./items');

module.exports = {
  Scene: function (nameOverride) {
      // TODO: Different types of Scenes with different items, terrain, etc
    this.name = nameOverride || util.capitalizeWord(lingua.word(Math.floor(Math.random() * 4)));
    this.npc = new Character();

    // TODO: Make several different intro possibilities
    this.introText = `You arrive in ${this.name}.`;

    // TODO: Make high amounts of loot less likely
    // TODO: Make this independent of number of items I've made up
    const numLootItems = Math.floor(Math.random() * items.length);
    const lootItems = util.randomFromArray(numLootItems, items);
    this.loot = lootItems;

    this.intro = function () {
        console.log(this.introText);
    }
  },
  createScene: function(nameOverride) {
    const self = this;
    const npc = new Character();
    const name =
      nameOverride ||
      util.capitalizeWord(lingua.word(Math.floor(Math.random() * 4)));
      const introText = `You arrive in ${name}.`;

    return {
      name,
      npc,
      introText,
      intro: function() {
        console.log(introText);
      }
    };
  },
  createMap: function(worldName) {
    const self = this;
    return [
      [
        { x: 0, y: 0, scene: new self.Scene(worldName), didIntro: false },
        { x: 1, y: 0, scene: self.createScene(), didIntro: false },
        { x: 2, y: 0, scene: self.createScene(), didIntro: false }
      ],
      [
        { x: 0, y: 1, scene: self.createScene(), didIntro: false },
        { x: 1, y: 1, scene: self.createScene(), didIntro: false },
        { x: 2, y: 1, scene: self.createScene(), didIntro: false }
      ],
      [
        { x: 0, y: 2, scene: self.createScene(), didIntro: false },
        { x: 1, y: 2, scene: self.createScene(), didIntro: false },
        { x: 2, y: 2, scene: self.createScene(), didIntro: false }
      ]
    ];
  },
  getSceneForTile(map, x, y) {
    let scene;
    map.forEach(row => {
      if (map.indexOf(row) === y) {
        row.forEach(column => {
          if (row.indexOf(column) === x) {
            scene = column;
          }
        });
      }
    });
    return scene.scene;
  }
};
