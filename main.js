const punctuation = "!@#$%&*;.,";
let startTime;
let textToType = generateWords(top1000);
let remaining = [...textToType];
let errors = 0;
let wpm = 0;

setState(textToType, wpm, errors);

function handleKeypress(e) {
  if (remaining.length == textToType.length) startTime = new Date();

  if (e.key == remaining[0]) remaining.shift();
  else errors++;

  if (remaining.length == 0) {
    if (e.key == "r") {
      textToType = generateWords(top1000);
      remaining = [...textToType];
      setText("text", remaining.join(""));
      errors = 0;
      return;
    }
    setText("text", "Finished! Press r to restart.");
    return;
  }

  wpm = calcWpm(startTime, textToType.length - remaining.length);
  if (wpm > 300) return;

  const text = remaining.join("");
  setState(text, wpm, errors);

  e.preventDefault();
}

// Helper functions
function generateWords(wordList) {
  const numberOfWords = parseInt(get("wordsNumber").value) || 10;
  if (get("capitalization").checked) wordList = wordList.map(capitalize);
  if (get("punctuation").checked) wordList = wordList.map(punctuate);
  if (get("numbers").checked) wordList = wordList.map(numerate);
  return shuffle(wordList).slice(1, numberOfWords).join(" ");
}

function calcWpm(startTime, charsTyped) {
  if (charsTyped == 0) return 0;
  let minutes = (new Date().getTime() - startTime.getTime()) / 1000 / 60;
  return Math.round(charsTyped / 5 / minutes);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function setState(text, wpm, errors) {
  setText("text", text);
  setText("errors", `Errors: ${errors}`);
  setText("wpm", `wpm: ${wpm}`);
}

function punctuate(string) {
  if (Math.random() > 0.5)
    return string + punctuation[Math.floor(Math.random() * punctuation.length)];
  else return string;
}

function numerate(string) {
  if (Math.random() < 0.2) return randRange(1, 1000).toString();
  else return string;
}

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function setText(id, text) {
  get(id).innerText = text;
}

function get(elem) {
  return document.getElementById(elem);
}

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

document.addEventListener("keypress", handleKeypress);
