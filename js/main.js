var WEEK_LABEL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var MONTH_LABEL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var selectedDate = new Date();
var selectedMonth = function () {
	return selectedDate.getMonth();
}

function Day (dm, dw, m, cm) {
	this.dayOfMonth = dm;
	this.dayOfWeek = dw;
	this.month = m;
	this.isCurrentMonth = cm;
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
	monthLabelElement.innerHTML = "";
	monthLabelElement.appendChild(document.createTextNode(monthAndYearLabel));
}

var renderMonthBody = function () {
	var month = buildMonthDays();
	var calendarBody = document.getElementById("calendar-body");
	calendarBody.innerHTML = "";
	month.forEach(function(week) {
		week.forEach(function(day) {
			calendarBody.appendChild(createDayDOM(day));
		})
	})
}

var renderCalendar = function () {
	renderNavElement();
	renderMonthBody();
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

	for(var i=0; i<6; i++) {
		month[i] = [];
		for(var j=0; j<7; j++) {
			var newDay;
			if (i === 0) {
				if (j >= firstDayOfMonth) {
					month[i][j] = new Day(currentMonthDate, j, selectedDate.getMonth(), true);
					currentMonthDate ++;

				} else {
					month[i][j] = new Day(previousMonthDate, j, selectedDate.getMonth(), false);
					previousMonthDate ++;
				}
			} else {
				if(currentMonthDate <= numberOfDays) {
					month[i][j] = new Day(currentMonthDate, j, selectedDate.getMonth(), true);
					currentMonthDate++;
				} else {
					month[i][j] = new Day(nextMonthDate, j, selectedDate.getMonth(), false);
					nextMonthDate ++;
				}
			}
		}
	}
	return month;
}

var createDayDOM = function (day) {
	var dayDOM = document.createElement('div');
	var today = new Date();

	if (day.dayOfWeek === 0 || day.dayOfWeek === 6) {
		dayDOM.setAttribute("class", "day-column weekend");
	} else {
		dayDOM.setAttribute("class", "day-column");
	}

	if(day.dayOfMonth === today.getDate() && today.getMonth() === day.month) {
		dayDOM.className += " today";
	}

	if(!day.isCurrentMonth) {
		dayDOM.className += " not-in-month"
	}

	dayDOM.innerHTML = "<span class='day-number'>"+ day.dayOfMonth + "</span>";

	return dayDOM;
}

var appendDayElement = function (date, day, currentMonth) {
	var calendarBody = document.getElementById("calendar-body");
	calendarBody.appendChild(renderDayElement(date, day, currentMonth));
}

var previousMonthClick = function () {
	selectedDate.setMonth(selectedMonth() - 1);
	renderCalendar();
}

var nextMonthClick = function () {
	selectedDate.setMonth(selectedMonth() + 1);
	renderCalendar();
}

renderCalendar();