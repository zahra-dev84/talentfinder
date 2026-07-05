const toggleThemeBtns = document.querySelectorAll(".toggle-theme");
const submenuOpenBtn = document.querySelector(".submenu-open-btn");
const submenu = document.querySelector(".submenu");
const navOpenBtn = document.querySelector(".nav-icon");
const nav = document.querySelector(".nav");
const navCloseBtn = document.querySelector(".nav-close-btn");
const overlay = document.querySelector(".overlay");

const userBtn = document.getElementById("userBtn");
const Dropdown = document.getElementById("Dropdown");
const logoutBtn=document.getElementById("logoutBtn");

function checkAuthUI() {

    const userId = localStorage.getItem("userId");

    const guestMenu = document.getElementById("guestMenu");
    const userMenu = document.getElementById("userMenu");

    if (userId) {

        // کاربر لاگین کرده
        guestMenu.classList.add("hidden");
        userMenu.classList.remove("hidden");

    } else {

        // کاربر ثبت نامی
        guestMenu.classList.remove("hidden");
        userMenu.classList.add("hidden");

    }

}

checkAuthUI();

// خزوج از حساب
if(logoutBtn){
    logoutBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        localStorage.clear();
        window.location.href="index.html"
    })
}

document.addEventListener("DOMContentLoaded", () => {

    const userBtn = document.getElementById("userBtn");
    const Dropdown = document.getElementById("Dropdown");

    userBtn.addEventListener("click", () => {
        Dropdown.classList.toggle("hidden");
    });

});



toggleThemeBtns.forEach(btn => {
    btn.addEventListener("click", function (){
        if (localStorage.theme === "dark"){
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme" , "dark");
        }
    })
})
submenuOpenBtn.addEventListener("click", (e) => {
    e.currentTarget.parentElement.classList.toggle("text-orange-300");
    submenu.classList.toggle("menu-open");
})

navOpenBtn.addEventListener("click",() => {
    nav.classList.remove("-right-64");
    nav.classList.add("right-0");
    overlay.classList.add("overlay--visible");

})

function closeNav() {
    nav.classList.remove("right-0");
    nav.classList.add("-right-64");
    overlay.classList.remove("overlay--visible");
}

navCloseBtn.addEventListener("click",closeNav)
overlay.addEventListener("click",closeNav)





    
