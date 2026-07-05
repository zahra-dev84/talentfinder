const params = new URLSearchParams(window.location.search);
const resultId = params.get("id");

// ---------- Load Result ----------
async function loadResult() {

    try {

        const response = await fetch(
            `http://127.0.0.1:5000/result/${resultId}`
        );

        const data = await response.json();

        const score = JSON.parse(
            data.score.replace(/'/g, '"')//به صورت رشته نتایج ذخیره میشه
        );

        showProfile(data);
        showStrengths(data);
        showJobs(data);
        showScores(score);

    } catch (err) {
        console.error("Error:", err);
    }
}

loadResult();


// ---------- Profile ----------
function showProfile(data){

    const container = document.querySelector("#profileCard");

    container.replaceChildren();

    const card = document.createElement("div");
    card.className = "bg-slate-800 rounded-3xl p-8 text-center";

    const icon = document.createElement("div");
    icon.textContent = "🌟";
    icon.className = "text-7xl mb-5";

    const title = document.createElement("h2");
    title.textContent = data.title;
    title.className = "text-4xl text-orange-400 font-bold mb-5";

    const desc = document.createElement("p");
    desc.textContent = data.description;
    desc.className = "text-white leading-9 text-lg";

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(desc);

    container.appendChild(card);
}


// ---------- Strengths ----------
function showStrengths(data){

    const container = document.querySelector("#strengths");

    container.replaceChildren();

    data.strengths.split(",").forEach(item => {

        const row = document.createElement("div");
        row.className = "flex gap-2 mb-2";

        const icon = document.createElement("span");
        icon.textContent = "✔";
        icon.className = "text-orange-500";

        const text = document.createElement("span");
        text.textContent = item.trim();

        row.appendChild(icon);
        row.appendChild(text);

        container.appendChild(row);

    });
}


// ---------- Jobs ----------
function showJobs(data){

    const container = document.querySelector("#jobs");

    container.replaceChildren();

    data.jobs.split(",").forEach(job => {

        const row = document.createElement("div");
        row.className = "flex gap-2 mb-2";

        const icon = document.createElement("span");
        icon.textContent = "💼";

        const text = document.createElement("span");
        text.textContent = job.trim();

        row.appendChild(icon);
        row.appendChild(text);

        container.appendChild(row);

    });
}


// ---------- Scores ----------
function showScores(score){

    const container = document.querySelector("#scores");

    container.replaceChildren();

    const labels = {
        R: "🔧 واقع‌گرا",
        I: "🧠 پژوهشگر",
        A: "🎨 هنری",
        S: "🤝 اجتماعی",
        E: "👑 کارآفرین",
        C: "💼 قراردادی"
    };

    const max = Math.max(...Object.values(score));

    Object.keys(score).forEach(key => {

        const value = score[key];

        const percent = max ? (value / max) * 100 : 0;

        const row = document.createElement("div");
        row.className = "mb-5";

        const header = document.createElement("div");
        header.className = "flex justify-between mb-2";

        const title = document.createElement("span");
        title.textContent = labels[key];

        const number = document.createElement("span");
        number.textContent = value;

        header.appendChild(title);
        header.appendChild(number);

        const barBg = document.createElement("div");
        barBg.className = "w-full bg-slate-200 rounded-full h-4";

        const barFill = document.createElement("div");
        barFill.className = "bg-orange-500 h-4 rounded-full transition-all duration-500";
        barFill.style.width = `${percent}%`;

        barBg.appendChild(barFill);

        row.appendChild(header);
        row.appendChild(barBg);

        container.appendChild(row);

    });
}