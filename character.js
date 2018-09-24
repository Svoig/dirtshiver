const lingua = require("./lingua");
const util = require("./util");
const items = require("./items");
const vocab = require("./vocab");

module.exports = {
  Character: function() {
    const self = this;
    const hasItem = util.coinFlip();
    const potentialDesiredItem = util.randomFromArray(1, items);
    // TODO: Why is this sometimes empty?
    const nameSyllables = Math.floor(Math.random() * 3) + 1;
    this.name = util.capitalizeWord(lingua.word(nameSyllables));

    this.inventory = hasItem ? [util.randomFromArray(1, items)] : [];

    this.desiredItem =
      self.inventory.indexOf(potentialDesiredItem) > -1
        ? undefined
        : potentialDesiredItem;
    this.greeting = self.desiredItem
      ? util.randomFromArray(1, vocab.want) + self.desiredItem
      : "Hello, traveler";
    this.hasGreeted = false;
    this.talk = function(message) {
      if (!message) {
        if (!self.hasGreeted) {
          console.log(
            `${self.name.toUpperCase()} : Hello, I am ${self.name}. ${
              self.greeting
            }.`
          );
          this.hasGreeted = true;
        } else if (self.desiredItem) {
          console.log(
            `${self.name.toUpperCase()}: Give me ${self.desiredItem}`
          );
        } else {
          // TODO: Multiple possibilities
          console.log(`${self.name.toUpperCase()} :  See ya.`);
        }
      } else {
        console.log(`${self.name.toUpperCase()} : ${message}`);
      }
    };
  }
};
