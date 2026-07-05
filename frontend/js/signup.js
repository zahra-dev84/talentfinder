let currentStep = 1;
const totalSteps = 2;

// المنت‌ها
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const progress = document.getElementById("progress");
const form = document.getElementById("multiStepForm");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const PhonNumber = document.getElementById("PhonNumber");
const email = document.getElementById("email");
const password = document.getElementById("password");
let isSubmitting = false;

function moveNext(currentInput, action) {
    currentInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        action();
    })
}
moveNext(firstName, () => lastName.focus());
moveNext(lastName, () => PhonNumber.focus());
moveNext(PhonNumber, () => document.getElementById("next1").click());
moveNext(email, () => password.focus());
moveNext(password, () => password.focus());

function checkRule(id, valid) {

    const rule = document.getElementById(id);

    const use = rule.querySelector("use");

    if (valid) {

        rule.classList.remove("text-red-500");
        rule.classList.add("text-green-500");

        use.setAttribute("xlink:href", "#icon_tik");

    } else {

        rule.classList.remove("text-green-500");
        rule.classList.add("text-red-500");

        use.setAttribute("xlink:href", "#icon");

    }

}

function isPasswordValid(value) {

    return (
        value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /\d/.test(value) &&
        /[@$!%*?&#]/.test(value)
    );

}

function toggleSubmitButton() {

    const submitBtn = document.getElementById("submitBtn");
    const value = password.value;

    const valid = isPasswordValid(value);

    submitBtn.disabled = !valid;

    if (valid) {

        submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
        submitBtn.classList.add("opacity-100");

    } else {

        submitBtn.classList.add("opacity-50", "cursor-not-allowed");
        submitBtn.classList.remove("opacity-100");

    }

}


const rules = [
    {
        id: "ruleLength",
        test: value => value.length >= 8
    },
    {
        id: "ruleUpper",
        test: value => /[A-Z]/.test(value)
    },
    {
        id: "ruleLower",
        test: value => /[a-z]/.test(value)
    },
    {
        id: "ruleNumber",
        test: value => /\d/.test(value)
    },
    {
        id: "ruleSpecial",
        test: value => /[@$!%*?&#]/.test(value)
    }
]
password.addEventListener("input", () => {

   const value=password.value;
   rules.forEach(rule =>{
    checkRule(rule.id, rule.test(value));
   })

    toggleSubmitButton();

});






// آپدیت UI مراحل
function updateUI() {
    step1.classList.add("hidden");
    step2.classList.add("hidden");

    if (currentStep === 1) step1.classList.remove("hidden");
    if (currentStep === 2) step2.classList.remove("hidden");

    progress.style.width = `${(currentStep / totalSteps) * 100}%`;
}

// مرحله 1 - 2
document.getElementById("next1").addEventListener("click", () => {
    if (!firstName.value.trim() || !lastName.value.trim()) {
        alert("نام و نام خانوادگی الزامی است");
        return;
    }
    const phone = PhonNumber.value.trim();
    if (phone.length !== 11) {
        alert("شماره موبایل باید 11 رقم باشد")
        return;
    }
    if (!phone.startsWith("09")) {
        alert("شماره موبایل باید با 09 شروع شود")
        return;
    }
    if (!/^\d+$/.test(phone)) {
        alert("شماره تلفن فقط باید شامل عدد باشد")
        return;
    }

    currentStep = 2;
    updateUI();
});



// برگشت‌ها
document.getElementById("back1").addEventListener("click", () => {
    currentStep = 1;
    updateUI();
});



// ثبت نهایی + ارسال به Flask
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;

    const emailValue = email.value.trim();
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(emailValue)) {
        alert("ایمیل معتبر وارد کنید.")
        return;
    }
    const value = password.value;
    if (!isPasswordValid(value)) {
        alert("رمز معتبر نیست")
        return;
    }

    const data = {
        firstName: firstName.value,
        lastName: lastName.value,
        PhonNumber: PhonNumber.value,
        email: email.value,
        password: password.value

    };

    try {
        const res = await fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        console.log("stat:", res.status);
        console.log("result", result)
        if (!res.ok) {
            alert(result.message);
            return;
        }

        localStorage.setItem("userId", result.id);
        window.location.href = "index.html";


        // ریست کامل
        form.reset();
        currentStep = 1;
        updateUI();
    } catch (err) {
        console.log(err);
        alert("خطا در ارتباط با سرور 😢");
    } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
    }
});