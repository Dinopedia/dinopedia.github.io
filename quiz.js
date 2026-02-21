const questionCountEl = document.getElementById("questionCount");
const questionTypeEl = document.getElementById("questionType");
const startQuizBtn = document.getElementById("startQuiz");
const quizArea = document.getElementById("quizArea");

let bank = [];
let questions = [];
let index = 0;
let score = 0;

function sampleOptions(items, exclude, count = 3) {
  const pool = [...new Set(items.filter(Boolean))].filter((x) => x !== exclude);
  pool.sort(() => Math.random() - 0.5);
  return pool.slice(0, count);
}

function buildQuestion(type, dino) {
  if (type === "period") {
    const correct = dino.period;
    return {
      prompt: `Which period did ${dino.name} live in?`,
      options: [correct, ...sampleOptions(bank.map((d) => d.period), correct)].sort(() => Math.random() - 0.5),
      answer: correct
    };
  }

  if (type === "diet") {
    const correct = dino.diet;
    return {
      prompt: `What diet category matches ${dino.name}?`,
      options: [correct, ...sampleOptions(bank.map((d) => d.diet), correct)].sort(() => Math.random() - 0.5),
      answer: correct
    };
  }

  const correct = dino.where;
  return {
    prompt: `Which region is associated with ${dino.name}?`,
    options: [correct, ...sampleOptions(bank.map((d) => d.where), correct)].sort(() => Math.random() - 0.5),
    answer: correct
  };
}

function renderQuestion() {
  if (index >= questions.length) {
    const percent = Math.round((score / questions.length) * 100);
    quizArea.innerHTML = `<h3>Finished</h3><p>Your score: ${score}/${questions.length} (${percent}%).</p><button id="restartQuiz" class="control-button" type="button">Play again</button>`;
    const restart = document.getElementById("restartQuiz");
    if (restart) restart.addEventListener("click", () => startQuiz());
    return;
  }

  const q = questions[index];
  quizArea.innerHTML = "";

  const progress = document.createElement("div");
  progress.className = "quiz-progress";
  const pct = Math.round((index / questions.length) * 100);
  progress.innerHTML = `<span style="width:${pct}%"></span>`;

  const h = document.createElement("h3");
  h.textContent = `Question ${index + 1} of ${questions.length}`;
  const p = document.createElement("p");
  p.textContent = q.prompt;

  quizArea.append(progress, h, p);

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "control-button quiz-option";
    btn.type = "button";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      const isCorrect = opt === q.answer;
      btn.classList.add(isCorrect ? "quiz-correct" : "quiz-wrong");
      if (opt === q.answer) score += 1;
      setTimeout(() => {
        index += 1;
        renderQuestion();
      }, 260);
    });
    quizArea.appendChild(btn);
  });
}

async function startQuiz() {
  const res = await fetch("data/index.json", { cache: "no-store" });
  if (!res.ok) {
    quizArea.textContent = "Could not load quiz data.";
    return;
  }

  bank = await res.json();
  const type = questionTypeEl.value;
  const count = Math.max(3, Math.min(30, Number(questionCountEl.value) || 10));

  questions = [];
  score = 0;
  index = 0;

  const shuffled = [...bank].sort(() => Math.random() - 0.5).slice(0, count);

  shuffled.forEach((dino) => {
    const qType = type === "mixed" ? ["period", "diet", "region"][Math.floor(Math.random() * 3)] : type;
    questions.push(buildQuestion(qType, dino));
  });

  renderQuestion();
}

startQuizBtn.addEventListener("click", startQuiz);
