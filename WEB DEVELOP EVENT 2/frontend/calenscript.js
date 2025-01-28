const currentDate = document.querySelector(".current-date");
const daysTag = document.querySelector(".days");
const prevNextIcon = document.querySelectorAll(".icons i");

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    const firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();
    const lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();

    let liTag = "";

    for (let i = firstDayOfMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        const isToday = i === date.getDate() && currMonth === date.getMonth() && currYear === date.getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
    attachDateClickEvent();
}

renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if (currMonth < 0) {
            currMonth = 11; // Wrap around to December if going to previous year
            currYear--;
        } else if (currMonth > 11) {
            currMonth = 0; // Wrap around to January if going to next year
            currYear++;
        }
        renderCalendar();
    });
});

function attachDateClickEvent() {
    const dates = document.querySelectorAll(".days li:not(.inactive)");
    dates.forEach(date => {
        date.addEventListener("click", () => {
            const selectedDate = date.innerText;
            const selectedMonth = currMonth + 1; // Month is zero-based index, so add 1
            const selectedYear = currYear;
            // Redirect to the booking form page with selected date parameters
            window.location.href = `book.html?date=${selectedYear}-${selectedMonth}-${selectedDate}`;
        });
    });
}
