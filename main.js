let scoreNumber = 0;
let timer = 10;
const maxTime = 10;

const score = document.getElementById("score");
const bestScore = document.getElementById("bestScore");
const yourScore = document.getElementById("yourScore");
const a = document.getElementById("a");
const b = document.getElementById("b");
const operation = document.getElementById("operation");
const result = document.getElementById("result");
const line = document.getElementById("line");
const refresh = document.getElementById("refresh");
const tbody = document.getElementById("tbody");

function play() {
  setTimeout(() => {
    document.getElementById("music").play();
  }, 2000);
}

const onload = () => {
  play();
};

const getRandomNumber = (start = 1, limit = 100) =>
  Math.floor(Math.random() * (limit - start + 1)) + start;

let aRandom, bRandom, operationRandom, trueAnswer, isTrue, wrongAnswer, answer;

const next = () => {
  aRandom = getRandomNumber();
  bRandom = getRandomNumber();
  operationRandom = getRandomNumber(1, 4);

  let operationString = "";
  switch (operationRandom) {
    case 1:
      operationString = "+";
      break;
    case 2:
      operationString = "-";
      if (bRandom > aRandom) [aRandom, bRandom] = [bRandom, aRandom];
      break;
    case 3:
      operationString = "x";
      aRandom %= 30;
      bRandom %= 14; // 1300
      break;
    case 4:
      operationString = "/";
      if (bRandom > aRandom) [aRandom, bRandom] = [bRandom, aRandom];
      bRandom = (bRandom % 14) + 1;
      let t = aRandom % bRandom;
      aRandom -= t;
      break;
  }
  operation.innerHTML = operationString;
  a.innerHTML = aRandom;
  b.innerHTML = bRandom;

  trueAnswer = eval(`${aRandom}${operationString}${bRandom}`.replace("x", "*"));
  isTrue = getRandomNumber(-1, 2) % 2;

  wrongAnswer = getRandomNumber(1, 30);
  answer = isTrue * wrongAnswer + trueAnswer;
  answer = Math.abs(answer);

  result.innerHTML = answer;
};
next();

const changeWidthLine = () => {
  let w = (100 / maxTime) * timer;
  line.style.width = `${w}%`;
};

let isGameOver = false;
const checkBestScore = () => {
  if (isGameOver) return;

  let oldBestScore = +localStorage.getItem("bestScore");

  yourScore.innerHTML = scoreNumber;

  if (oldBestScore < scoreNumber) {
    localStorage.setItem("bestScore", scoreNumber);
    bestScore.innerHTML = scoreNumber;

    refresh.classList.add("bg-success");
    refresh.classList.remove("bg-danger");
  } else {
    bestScore.innerHTML = oldBestScore;
    refresh.classList.remove("bg-success");
    refresh.classList.add("bg-danger");
  }

  let allScores = JSON.parse(localStorage.getItem("allScores")) || [];

  let scores = [...allScores, scoreNumber].sort((a, b) => a - b);
  scores = [...new Set(scores)];

  let topScores = scores.slice(-7);

  localStorage.setItem("allScores", JSON.stringify(scores));

  topScores.reverse().map((s, i) => {
    const row = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.innerHTML = i + 1;
    td1.className = "fw-bold";

    const td2 = document.createElement("td");
    td2.innerHTML = s;

    if (s == scoreNumber) {
      const classes = ["bg-warning", "text-white"];
      td1.classList.add(...classes);
      td2.classList.add(...classes);
    }

    row.appendChild(td1);
    row.appendChild(td2);

    tbody.appendChild(row);
  });

  isGameOver = true;
};

const check = (selectedAnswer) => {
  if (timer <= 0) {
    refresh.classList.remove("d-none");
    checkBestScore();
    return;
  }

  let isWin = !(!isTrue ^ selectedAnswer);
  if (isWin) {
    scoreNumber++;
    timer += 3;
  } else {
    timer -= 3;
  }

  if (timer > maxTime) timer = maxTime;
  changeWidthLine();

  score.innerHTML = scoreNumber;

  next();
};

let interval;
const startTimer = () => {
  interval = setInterval(() => {
    if (timer <= 0) {
      refresh.classList.remove("d-none");
      clearInterval(interval);
      checkBestScore();
      return;
    }

    timer--;

    changeWidthLine();
  }, 600);
};

startTimer();

const reload = () => {
  window.location.reload(true);
};
