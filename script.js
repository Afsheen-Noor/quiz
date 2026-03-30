let questions = [];
let userAnswers = [];
let currentQuestion = 0;
let username = "";
let timeLeft = 15;
let timer;

async function startQuiz() {
    username = document.getElementById("username").value;

    if (username === "") {
        alert("Please enter your name");
        return;
    }

    // Fetch questions from backend
    const res = await fetch("https://quiz-hh6t.onrender.com/questions");
    questions = await res.json();

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");

    loadQuestion();
}
const options = [
  question.option1,
  question.option2,
  question.option3,
  question.option4
];



function loadQuestion() 
{
    let q = questions[currentQuestion];

    options.forEach((opt) => {
  const btn = document.createElement("button");
  btn.innerText = opt;
  btn.onclick = () => selectAnswer(opt);
  optionsContainer.appendChild(btn);
});

    document.getElementById("options").innerHTML = optionsHTML;

    startTimer(); // ✅ start timer for each question
}

function startTimer() {
    clearInterval(timer); // reset previous timer
    timeLeft = 15;

    document.getElementById("timer").innerText = `Time left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Time left: ${timeLeft}s`;

        if (timeLeft <= 0) 
        {
          clearInterval(timer);
           nextQuestion(); // ✅ THIS LINE IS IMPORTANT
             
         }
    }, 1000);
}

function selectAnswer(selected, element) {
    userAnswers[currentQuestion] = selected;

    // Remove selection from all options
    let options = document.querySelectorAll(".option");
    options.forEach(opt => opt.classList.remove("selected"));

    // Add selection to clicked option
    element.classList.add("selected");
}

function nextQuestion() {
    clearInterval(timer); // stop timer

    // If no answer selected, mark as null
    if (!userAnswers[currentQuestion]) {
        userAnswers[currentQuestion] = null;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}
async function showResult() {
    const res = await fetch("https://quiz-hh6t.onrender.com/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            answers: userAnswers
        })
    });

    const data = await res.json();

    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");

    document.getElementById("result-text").innerText =
       `🎉 Great job ${username}! Your result is ${data.score}/${questions.length}`
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;

    document.getElementById("result-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
}