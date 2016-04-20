var WEEK_LABEL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var MONTH_LABEL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var selectedDate = new Date();
var selectedMonth = function () {
	return selectedDate.getMonth();
}

function Day (d) {
	this.day = d;
};

Date.prototype.monthDays= function(){
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}

Date.prototype.firstDayOfMonth= function(){
    var d= new Date(this.getFullYear(), this.getMonth(), 1);
    return d.getDay();
}

var renderNavElement = function () {
	var currentMonth = MONTH_LABEL[selectedDate.getMonth()];
	var currentYear = selectedDate.getFullYear();
	var monthAndYearLabel = currentMonth + ", " + currentYear;

	var monthLabelElement = document.getElementById("month-label");
	monthLabelElement.appendChild(document.createTextNode(monthAndYearLabel));
}


var buildMonthDays = function () {
	var month = [];
	var numberOfDays = selectedDate.monthDays();
	var lastMonthDate = new Date(selectedDate);
	lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
	var numberOfDaysLastMonth = lastMonthDate.monthDays();

	var firstDayOfMonth = selectedDate.firstDayOfMonth();

	var previousMonthDate = numberOfDaysLastMonth - firstDayOfMonth + 1;
	var currentMonthDate = 1;
	var nextMonthDate = 1;

	var calendarBody = document.getElementById("calendar-body");
	var isThisMonth = false;

	for(var i=0; i<6; i++) {
		month[i] = [];
		for(var j=0; j<7; j++) {

			if (i === 0) {
				if (j >= firstDayOfMonth) {
					month[i][j] = currentMonthDate;
					currentMonthDate ++;
					isThisMonth = true;

				} else {
					month[i][j] = previousMonthDate;
					previousMonthDate ++;
					isThisMonth = false;
				}
			} else {
				if(currentMonthDate <= numberOfDays) {
					month[i][j] = currentMonthDate;
					currentMonthDate++;
					isThisMonth = true;
				} else {
					month[i][j] = nextMonthDate;
					nextMonthDate ++;
					isThisMonth = false;
				}
			}

			appendDayElement(month[i][j], j, isThisMonth);
		}
	}

	return month;
}

var renderDayElement = function (date, day, currentMonth) {
	var dayElement = document.createElement('div');
	var today = new Date();

	if (day === 0 || day === 6) {
		dayElement.setAttribute("class", "day-column weekend");
	} else {
		dayElement.setAttribute("class", "day-column");
	}

	if(date === today.getDate()) {
		dayElement.className += " today";
	}

	if(!currentMonth) {
		dayElement.className += " not-in-month"
	}

	dayElement.innerHTML = "<span class='day-number'>"+ date + "</span>";

	return dayElement;
}

var appendDayElement = function (date, day, currentMonth) {
	var calendarBody = document.getElementById("calendar-body");
	calendarBody.appendChild(renderDayElement(date, day, currentMonth));
}

var previousMonthClick = function () {
	selectedDate.setMonth(selectedMonth() - 1);
	rerenderCalendar();
	rerenderMonthLabel();
}

var nextMonthClick = function () {
	selectedDate.setMonth(selectedMonth() + 1);
	rerenderCalendar();
	rerenderMonthLabel();
}

var rerenderCalendar = function () {
	var calendarBody = document.getElementById("calendar-body");
	calendarBody.innerHTML = "";
	buildMonthDays();
}

var rerenderMonthLabel = function () {
	var monthLabelElement = document.getElementById("month-label");
	monthLabelElement.innerHTML = "";
	renderNavElement();
}

renderNavElement();
buildMonthDays();