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
	this.events = [];
};

function Event (eventName, evenType, startTime, endTime) {
	this.eventName = eventName;
	this.evenType = evenType;
	this.startTime = startTime;
	this.endTime = endTime;
	this.notes = notes;
}

var month = [];

Date.prototype.monthDays= function(){
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}

Date.prototype.firstDayOfMonth= function(){
    var d= new Date(this.getFullYear(), this.getMonth(), 1);
    return d.getDay();
}

var renderNavElement = function () {
	var navDOM = document.getElementById('nav');
	var monthNavDOM = document.getElementById('month-nav');

	var previousMonthButton = document.createElement('button');
	previousMonthButton.setAttribute('type', 'button');
	previousMonthButton.setAttribute('onclick', 'previousMonthClick()');
	previousMonthButton.appendChild(document.createTextNode('Previous'));

	var nextMonthButton = document.createElement('button');
	nextMonthButton.setAttribute('type', 'button');
	nextMonthButton.setAttribute('onclick', 'nextMonthClick()');
	nextMonthButton.appendChild(document.createTextNode('Next'));

	monthNavDOM.appendChild(previousMonthButton);
	monthNavDOM.appendChild(nextMonthButton);

	navDOM.insertBefore(monthNavDOM, navDOM.firstChild);

	renderMonthLabel();
}

var renderMonthLabel = function () {
	var currentMonth = MONTH_LABEL[selectedDate.getMonth()];
	var currentYear = selectedDate.getFullYear();
	var monthAndYearLabel = currentMonth + ", " + currentYear;
	var monthLabelElement = document.getElementById("month-label");
	monthLabelElement.setAttribute("onclick", "monthLabelClick()");

	monthLabelElement.innerHTML = "";
	monthLabelElement.appendChild(document.createTextNode(monthAndYearLabel));
}

var renderCalendar = function () {
	var mainContainer = document.getElementById('main-container');
	var calendarContainer = document.createElement('div');
	calendarContainer.setAttribute('id', 'calendar-container');
	mainContainer.appendChild(calendarContainer);

	renderNavElement();		
	renderCalendarHeader();
	renderMonthBody();
}

var renderCalendarHeader = function () {
	var calendarContainer = document.getElementById('calendar-container');
	var headRow = document.createElement('div');
	headRow.setAttribute('id', 'header-row');
	for(var i=0; i<7 ; i++) {
		headRow.appendChild(renderCalendarHeaderColumn(i));
	}

	calendarContainer.insertBefore(headRow, calendarContainer.firstChild);
}

var renderCalendarHeaderColumn = function (dayNumber) {
	var headerColumn = document.createElement('div');

	if(dayNumber === 0 || dayNumber === 6) {
		headerColumn.setAttribute('class', 'day-column weekend');
	} else {
		headerColumn.setAttribute('class', 'day-column');
	}

	headerColumn.appendChild(document.createTextNode(WEEK_LABEL[dayNumber]));

	return headerColumn;
}

var renderMonthBody = function () {
	buildMonthDays();
	var calendarContainer = document.getElementById('calendar-container');
	var calendarBody = document.createElement("div");
	calendarBody.setAttribute('id', 'calendar-body');
	calendarContainer.appendChild(calendarBody);

	calendarBody.innerHTML = "";
	month.forEach(function(week, i) {
		week.forEach(function(day, j) {
			var dayDOM = createDayDOM(day);
			dayDOM.week = i;
			dayDOM.day = j;
			calendarBody.appendChild(dayDOM);
		})
	})
}

var buildMonthDays = function () {
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
}

var createDayDOM = function (day) {
	var dayDOM = document.createElement('div');
	var today = new Date();

	if (day.dayOfWeek === 0 || day.dayOfWeek === 6) {
		dayDOM.setAttribute("class", "day-column weekend");
	} else {
		dayDOM.setAttribute("class", "day-column");
	}

	dayDOM.setAttribute("onmouseover", "mouseOverDayDOM(this)");
	dayDOM.setAttribute("onclick", "mouseClickDayDOM(this)");

	if(day.dayOfMonth === today.getDate() && today.getMonth() === day.month) {
		dayDOM.className += " today";
	}

	if(!day.isCurrentMonth) {
		dayDOM.className += " not-in-month"
	}

	dayDOM.innerHTML = "<span class='day-number'>"+ day.dayOfMonth + "</span>";


	return dayDOM;
}

var mouseOverDayDOM = function (ele) {
	var dayNumberDOM = ele.getElementsByClassName('day-number');
	var thisDay = dayNumberDOM[0].textContent;
}

var mouseClickDayDOM = function (ele) {
	var day = month[ele.week][ele.day];
	renderEventListDOM(day);
}

var appendDayElement = function (date, day, currentMonth) {
	var calendarBody = document.getElementById("calendar-body");
	calendarBody.appendChild(renderDayElement(date, day, currentMonth));
}

var previousMonthClick = function () {
	selectedDate.setMonth(selectedMonth() - 1);
	renderMonthLabel();
	renderMonthBody();
}

var nextMonthClick = function () {
	selectedDate.setMonth(selectedMonth() + 1);
	renderMonthLabel();
	renderMonthBody();
}

var monthLabelClick = function () {
	resetDOM();
	renderCalendar();
}

var renderEventListDOM = function (day) {
	resetDOM();
	var eventListContainer = document.getElementById('event-list-container');
	var eventList = document.createElement("div");

	eventList.setAttribute('class', 'event-list');

	eventListContainer.appendChild(eventList);

	var monthNavDOM = document.getElementById('month-nav');

	if(day.events.length) {
		day.events.forEach(function(event) {
			renderEventDOM(event);
		});
	} else {
		eventList.innerHTML = "";
		eventList.appendChild(document.createTextNode("There is no event."));
	}
	renderEventViewNav();
}

var renderEventDOM = function (event) {

}

var renderEventViewNav = function (day) {
	var newEvent = document.getElementById("new-event");
	var newEventButton = document.createElement('button');
	newEventButton.setAttribute('type', 'button');
	newEventButton.setAttribute('onclick', 'addEventClick()');
	newEventButton.appendChild(document.createTextNode('New event'));

	newEvent.appendChild(newEventButton);
}

var resetDOM = function () {
	var eventListContainer = document.getElementById('event-list-container');
	var monthNav = document.getElementById('month-nav');
	var calendarContainer = document.getElementById('calendar-container');
	var newEvent = document.getElementById("new-event");


	monthNav.innerHTML = "";
	calendarContainer.innerHTML = "";
	eventListContainer.innerHTML = "";
	newEvent.innerHTML = "";
}

renderCalendar();