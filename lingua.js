const alpha = require('./alpha');
const util = require('./util');

module.exports = {
  syllable: function() {
    const consonant= util.randomFromArray(1, alpha.consonants);
    const vowel= util.randomFromArray(1, alpha.vowels);
    return consonant.name + vowel.name;
  },
  word: function(syllables) {
    // Most naive approach to get something working. Does CVCVCV...
    let newWord = "";
    for (let i = 0; i < syllables; i++) {
      newWord += this.syllable();
    }
    return newWord;
  }
};
