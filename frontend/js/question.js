const questionElement = document.querySelector("#question");
const answersContainer = document.querySelector("#answers");

const nextButton = document.querySelector("#nextBtn");
const prevButton = document.querySelector("#prevBtn");

const progressBar = document.querySelector("#progressBar");

const currentQuestionElement = document.querySelector("#currentQuestion");
const totalQuestionElement = document.querySelector("#totalQuestion");

const userId = localStorage.getItem("userId");
if (!userId) {
    window.location.href = "login.html"
}
// ---------- تنظیمات ----------
const TOTAL_QUESTIONS = 24;

let currentQuestion = 1;
let selectedAnswer = null;//هنوز سوالی انتخاب نشده
const userAnswers = [];//تمام جواب هارو نگهه میداره

// ---------- لود سوال ----------
async function loadQuestion() {
    try {
        const response = await fetch(
            `http://127.0.0.1:5000/question/${currentQuestion}`
        );

        if (!response.ok) {
            throw new Error("خطا در دریافت اطلاعات");
        }

        const data = await response.json();

        showQuestion(data);
        updateProgress();
        updateNextButton(); 

    } catch (error) {
        console.error(error);
    }
}

// ---------- نمایش سوال ----------
function showQuestion(data) {

    questionElement.textContent = data.question.text;
    answersContainer.innerHTML = "";
    selectedAnswer = null;
    const savedAnswer = userAnswers.find(
        item => item.question_id === data.question.id

    );
    if (savedAnswer) {
        selectedAnswer = data.answers.find(
            answer => answer.id === savedAnswer.answer_id
        )
    }

    data.answers.forEach(answer => {

        const button = document.createElement("button");

        button.textContent = answer.text;

        button.className =
            "w-full p-4 rounded-xl border border-slate-700 bg-slate-800 text-white hover:bg-orange-500 hover:border-orange-500 transition";
        if (selectedAnswer && answer.id === selectedAnswer.id) {
            button.classList.remove("bg-slate-800", "border-slate-700");
            button.classList.add("bg-orange-500", "border-orange-500");
        }
        button.addEventListener("click", () => {

            // پاک کردن انتخاب قبلی
            document.querySelectorAll("#answers button")
                .forEach(btn => {
                    btn.classList.remove("bg-orange-500", "border-orange-500");
                    btn.classList.add("bg-slate-800", "border-slate-700");
                });

            // انتخاب جدید
            button.classList.remove("bg-slate-800", "border-slate-700");
            button.classList.add("bg-orange-500", "border-orange-500");

            selectedAnswer = answer;
        });

        answersContainer.append(button);
    });
}

// ---------- progress ----------
function updateProgress() {
    currentQuestionElement.textContent = currentQuestion;
    totalQuestionElement.textContent = TOTAL_QUESTIONS;

    const percent = (currentQuestion / TOTAL_QUESTIONS) * 100;
    progressBar.style.width = `${percent}%`;
}

// ---------- دکمه Next ----------
nextButton.addEventListener("click", () => {

    if (!selectedAnswer) {
        alert("لطفاً یک گزینه انتخاب کنید.");
        return;
    }

    // ذخیره جواب
    const index = userAnswers.findIndex(
        item => item.question_id === currentQuestion
    );

    if (index === -1) {

        userAnswers.push({
            question_id: currentQuestion,
            answer_id: selectedAnswer.id,
            category: selectedAnswer.category
        });

    } else {

        userAnswers[index] = {
            question_id: currentQuestion,
            answer_id: selectedAnswer.id,
            category: selectedAnswer.category
        };

    }

    if (currentQuestion < TOTAL_QUESTIONS) {

        currentQuestion++;
        loadQuestion();

    } else {

        submitQuiz(); // ⭐ پایان آزمون
    }
});

// ---------- دکمه Prev ----------
prevButton.addEventListener("click", () => {

    if (currentQuestion > 1) {
        currentQuestion--;
        loadQuestion();
    }
});

// ---------- تغییر دکمه Next به Submit ----------
function updateNextButton() {

    if (currentQuestion === TOTAL_QUESTIONS) {
        nextButton.textContent = "ثبت آزمون";
        nextButton.classList.add("bg-green-500");
        nextButton.classList.remove("bg-orange-500");
    } else {
        nextButton.textContent = "بعدی";
        nextButton.classList.remove("bg-green-500");
        nextButton.classList.add("bg-orange-500");
    }
}

// ---------- ثبت آزمون ----------
async function submitQuiz() {

    const result = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    userAnswers.forEach(a => {
        result[a.category]++;
    });
    console.log("userAnswer:", userAnswers);
    console.log("result", result);
    const topType = Object.keys(result).reduce((a, b) =>
        result[a] > result[b] ? a : b
    );
    console.log("toptype", topType)
    const userId = localStorage.getItem("userId");

    const res = await fetch("http://127.0.0.1:5000/save-result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: userId,
            type: topType,
            score: result
        })
    });

    const data = await res.json();

    window.location.href = `/result.html?id=${data.id}`;
}
// ---------- شروع ----------
loadQuestion();