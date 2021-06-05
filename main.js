const punctuation = "!@#$%&*;.,|";
const surroundings = [
  { l: "{", r: "}" },
  { l: "[", r: "]" },
  { l: "(", r: ")" },
  { l: '"', r: '"' },
  { l: "'", r: "'" },
];

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
  words = wordList.map((word) =>
    pipe(
      word,
      condCheck("capitalization", capitalize),
      condCheck("punctuation", punctuate),
      condCheck("numbers", numerate),
      condCheck("surroundings", surround)
    )
  );
  return shuffle(words).slice(1, numberOfWords).join(" ");
}

function condApply(pred, f) {
  if (pred) return (x) => f(x);
  else return (x) => x;
}

function condCheck(id, f) {
  return condApply(checked(id), f);
}

function checked(id) {
  return get(id).checked;
}

function calcWpm(startTime, charsTyped) {
  if (charsTyped == 0) return 0;
  let minutes = (new Date().getTime() - startTime.getTime()) / 1000 / 60;
  return Math.round(charsTyped / 5 / minutes);
}

function capitalize(string) {
  return pipe(
    string,
    condApply(
      chance(70 / 100),
      (str) => str.charAt(0).toUpperCase() + str.slice(1)
    )
  );
}

function punctuate(string) {
  return pipe(
    string,
    condApply(chance(50 / 100), (str) => str + pickRandom(punctuation))
  );
}

function surround(string) {
  surround = pickRandom(surroundings);
  return pipe(
    string,
    condApply(chance(15 / 100), (str) => surround.l + str + surround.r)
  );
}

function numerate(string) {
  return pipe(
    string,
    condApply(chance(20 / 100), () => randRange(1, 1000).toString())
  );
}

function pickRandom(array) {
  array[Math.floor(Math.random() * array.length)];
}

function setState(text, wpm, errors) {
  setText("text", text);
  setText("errors", `Errors: ${errors}`);
  setText("wpm", `wpm: ${wpm}`);
}

function chance(percentage) {
  return Math.random() < percentage;
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
