module.exports = {
  randomArrayIndex: function(sourceArray) {
    // TODO: Is this + 1 skipping indexes?
    return Math.floor(Math.random() * sourceArray.length - 1) + 1;
  },
  randomFromArray: function(numItems, sourceArray) {
    // Return item at random index of array
    const randomIndexes = [];
    for (let i = 0; i < numItems; i++) {
      randomIndexes.push(this.randomArrayIndex(sourceArray));
    }

    if (randomIndexes.length === 1) {
      return sourceArray[randomIndexes[0]];
    }

    return randomIndexes.map((i) => sourceArray[i]);
  },
  capitalizeWord: function(word) {
    const firstLetter = word.slice(0,1).toUpperCase();
    const end = word.slice(1);
    return  firstLetter + end;
  },
  coinFlip: function() {
    return Math.floor(Math.random() * 10) % 2 === 0;
  }
};
