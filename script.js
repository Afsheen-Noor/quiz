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



function loadQuestion() {
    let q = questions[currentQuestion];

    document.getElementById("question").innerText = q.question;

    let options = [
        q.option1,
        q.option2,
        q.option3,
        q.option4
    ];

    let optionsHTML = "";

    options.forEach(option => {
        let selectedClass = userAnswers[currentQuestion] === option ? "selected" : "";

        optionsHTML += `
            <div class="option ${selectedClass}" 
                 onclick="selectAnswer('${option}', this)">
                ${option}
            </div>
        `;
    });

    document.getElementById("options").innerHTML = optionsHTML;

    startTimer();
}

function startTimer() {
    clearInterval(timer); // stop old timer

    timeLeft = 15;

    const timerElement = document.getElementById("timer");
    timerElement.innerText = `Time left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `Time left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion(); // move automatically
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