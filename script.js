let questions = [];
let userAnswers = [];
let currentQuestion = 0;
let username = "";
let timeLeft = 10;
let timer;

async function startQuiz() {
    username = document.getElementById("username").value;

    if (username === "") {
        alert("Please enter your name");
        return;
    }

    // Fetch questions from backend
    const res = await fetch("http://localhost:3000/questions");
    questions = await res.json();

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");

    loadQuestion();
}

function loadQuestion() 
{
    let q = questions[currentQuestion];

    document.getElementById("question").innerText = q.question;

    let optionsHTML = "";
    q.options.forEach(option => {
        let selectedClass = userAnswers[currentQuestion] === option ? "selected" : "";

        optionsHTML += `
            <div class="option ${selectedClass}" 
                 onclick="selectAnswer('${option}', this)">
                ${option}
            </div>
        `;
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
    const res = await fetch("http://localhost:3000/submit", {
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