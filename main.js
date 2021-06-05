let startTime;
let textToType = generateWords(top1000);
let remaining = [...textToType];
let errors = 0;
let wpm = 0;

setText("text", textToType);
setText("errors", `Errors: ${errors}`);
setText("wpm", `wpm: ${wpm}`);

function onKeyPress(e) {
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

  let minutes = (new Date().getTime() - startTime.getTime()) / 1000 / 60;
  let charsTyped = textToType.length - remaining.length;
  let wpm = Math.round(charsTyped / 5 / minutes);
  if (wpm > 300) return;

  setText("wpm", `wpm: ${wpm}`);
  setText("text", remaining.join(""));
  setText("errors", `Errors: ${errors}`);
}

// Helper functions
function generateWords(wordList) {
  const numberOfWords = parseInt(get("wordsNumber").value) || 10;
  if (get("capitalization").checked) wordList = wordList.map(capitalize);
  return shuffle(wordList).slice(1, numberOfWords).join(" ");
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

document.addEventListener("keypress", onKeyPress);
