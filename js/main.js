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

function Event (id, name, type, start, end, notes) {
	this.id = id;
	this.name = name;
	this.type = type;
	this.start = start;
	this.end = end;
	this.notes = notes;
}

var month = [];
var selectedDay = {
	week: -1,
	day: -1
}

Date.prototype.monthDays= function() {
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}

Date.prototype.firstDayOfMonth= function() {
    var d= new Date(this.getFullYear(), this.getMonth(), 1);
    return d.getDay();
}

var renderNavElement = function() {
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

var renderMonthLabel = function() {
	var currentMonth = MONTH_LABEL[selectedDate.getMonth()];
	var currentYear = selectedDate.getFullYear();
	var monthAndYearLabel = currentMonth + ", " + currentYear;
	var monthLabelElement = document.getElementById("month-label");
	monthLabelElement.setAttribute("onclick", "monthLabelClick()");

	monthLabelElement.innerHTML = "";
	monthLabelElement.appendChild(document.createTextNode(monthAndYearLabel));
}

var renderCalendar = function() {
	var mainContainer = document.getElementById('main-container');
	var calendarContainer = document.createElement('div');
	calendarContainer.setAttribute('id', 'calendar-container');
	mainContainer.appendChild(calendarContainer);

	renderNavElement();		
	renderCalendarHeader();
	renderMonthBody();
}

var renderCalendarHeader = function() {
	var calendarContainer = document.getElementById('calendar-container');
	var headRow = document.createElement('div');
	headRow.setAttribute('id', 'header-row');
	for(var i=0; i<7 ; i++) {
		headRow.appendChild(renderCalendarHeaderColumn(i));
	}

	calendarContainer.insertBefore(headRow, calendarContainer.firstChild);
}

var renderCalendarHeaderColumn = function(dayNumber) {
	var headerColumn = document.createElement('div');

	if(dayNumber === 0 || dayNumber === 6) {
		headerColumn.setAttribute('class', 'day-column weekend');
	} else {
		headerColumn.setAttribute('class', 'day-column');
	}

	headerColumn.appendChild(document.createTextNode(WEEK_LABEL[dayNumber]));

	return headerColumn;
}

var renderMonthBody = function() {
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

var buildMonthDays = function() {
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

var createDayDOM = function(day) {
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

var mouseOverDayDOM = function(ele) {
	var dayNumberDOM = ele.getElementsByClassName('day-number');
	var thisDay = dayNumberDOM[0].textContent;
}

var mouseClickDayDOM = function(ele) {
	var day = month[ele.week][ele.day];
	selectedDay.week = ele.week;
	selectedDay.day = ele.day;
	renderEventListDOM(day);
}

var appendDayElement = function(date, day, currentMonth) {
	var calendarBody = document.getElementById("calendar-body");
	calendarBody.appendChild(renderDayElement(date, day, currentMonth));
}

var previousMonthClick = function() {
	selectedDate.setMonth(selectedMonth() - 1);
	renderMonthLabel();
	renderMonthBody();
}

var nextMonthClick = function() {
	selectedDate.setMonth(selectedMonth() + 1);
	renderMonthLabel();
	renderMonthBody();
}

var monthLabelClick = function() {
	resetDOM();
	renderCalendar();
}

var renderEventListDOM = function(day) {
	resetDOM();
	var eventListContainer = document.getElementById('event-list-container');
	var eventList = document.createElement("div");

	eventList.setAttribute('id', 'event-list');

	eventListContainer.appendChild(eventList);

	var monthNavDOM = document.getElementById('month-nav');

	if(day.events) {
		day.events.forEach(function(event) {
			eventList.appendChild(renderEventDOM(event));
		});
	} else {
		eventList.innerHTML = "";
		eventList.appendChild(document.createTextNode("There is no event."));
	}

	renderEventViewNav();
}

var renderEventDOM = function(event) {
	var thisEventDOM = document.createElement('div');
	thisEventDOM.setAttribute('id', 'event'+event.id);
	thisEventDOM.setAttribute('class', 'event');
	var title = document.createElement('div');
	var time = document.createElement('div');
	var notes = document.createElement('div');
	var edit = document.createElement('div');
	var editClick = document.createElement('a');
	var removeClick = document.createElement('a');

	edit.setAttribute('id', 'edit-event');

	editClick.appendChild(document.createTextNode("Edit"));
	editClick.setAttribute('href', '#');
	editClick.setAttribute('onclick', 'editEventClick(this.parentNode.parentNode)');
	editClick.setAttribute('style', 'margin-right: 10px');
	edit.appendChild(editClick);

	removeClick.appendChild(document.createTextNode("Remove"));
	removeClick.setAttribute('href', '#');
	removeClick.setAttribute('onclick', 'removeEventClick()');
	edit.appendChild(removeClick);
	
	title.setAttribute('class', 'event-title');
	time.setAttribute('class', 'event-time');
	notes.setAttribute('class', 'event-notes');

	title.appendChild(document.createTextNode(event.name));
	if(event.start && event.end) {
		time.appendChild(document.createTextNode(event.start + ' - ' + event.end));
	}
	if(event.notes) {
		notes.appendChild(document.createTextNode(event.notes));
	} else {
		notes.appendChild(document.createTextNode("no notes"));
	}

	thisEventDOM.appendChild(notes);
	thisEventDOM.insertBefore(time, notes);
	thisEventDOM.insertBefore(title, time);
	thisEventDOM.insertBefore(edit, title);

	return thisEventDOM;
}

var renderEventViewNav = function(day) {
	var newEvent = document.getElementById("new-event");
	var newEventButton = document.createElement('button');
	newEventButton.setAttribute('type', 'button');
	newEventButton.setAttribute('onclick', 'newEventClick(this)');
	newEventButton.setAttribute('id', 'modal_open');
	newEventButton.appendChild(document.createTextNode('New event'));

	newEvent.appendChild(newEventButton);
}

var editEventClick = function(e) {
	var title = e.getElementsByClassName('event-title')[0];
	var notes = e.getElementsByClassName('event-notes')[0];
		console.log("notes", notes);


	var titleValue = title.textContent;
	var titleInput = document.createElement('input');
	titleInput.setAttribute('type', 'text');
	titleInput.setAttribute('value', titleValue);
	titleInput.setAttribute('class', 'edit-title');

	
	var notesValue = notes.textContent;
	var notesInput = document.createElement('textarea');
	notesInput.setAttribute('class', 'edit-notes');
	notesInput.setAttribute('value', notesValue);
	
	
	var save = document.createElement('button');
	save.setAttribute('type', 'button');
	save.setAttribute('onclick', 'saveEdittedEventClick(this.parentNode)');
	save.appendChild(document.createTextNode('Save'));

	var cancel = document.createElement('button');
	cancel.setAttribute('type', 'button');
	cancel.setAttribute('onclick', 'cancelEdittedEventClick(this.parentNode)');
	cancel.appendChild(document.createTextNode('Cancel'));


	title.textContent = "";
	// notes.textContent = "";
	title.appendChild(titleInput);
	// notes.appendChild(notesInput);
	e.appendChild(save);
	e.appendChild(cancel);
}

var saveEdittedEventClick = function(e) {
	var name = e.getElementsByClassName('edit-title')[0].value;
	if(!name) {
		alert("Missing event title! please type the event title.");
		return;
	}

	var id = e.id;
	id = parseInt(id.replace("event", ""));

	month[selectedDay.week][selectedDay.day].events[id].name = name;

	renderEventListDOM(month[selectedDay.week][selectedDay.day]);
}

var cancelEdittedEventClick = function(){
	renderEventListDOM(month[selectedDay.week][selectedDay.day]);
}

//The code for the new event modal is edited based on a online tutorial 
//source: http://www.the-art-of-web.com/javascript/feedback-modal-window/
var newEventClick = function(e) {
	var modalWrapper = document.getElementById("modal-wrapper");
    var modalWindow  = document.getElementById("modal-window");


	modalWrapper.className = "overlay";
	  var overflow = modalWindow.offsetHeight - document.documentElement.clientHeight;
	  if(overflow > 0) {
	    modalWindow.style.maxHeight = (parseInt(window.getComputedStyle(modalWindow).height) - overflow) + "px";
	  }
	  modalWindow.style.marginTop = (-modalWindow.offsetHeight)/2 + "px";
	  modalWindow.style.marginLeft = (-modalWindow.offsetWidth)/2 + "px";
	  e.preventDefault ? e.preventDefault() : e.returnValue = false;
}

var modalCloseClick = function(e) {
	var modalWrapper = document.getElementById("modal-wrapper");
	modalWrapper.className = "";
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
}

var addEventClick = function() {
	var name = document.getElementById('new-event-name').value;

	if(!name) {
		alert("Missing event title! please type the event title.");
		return;
	}

	var type = "";
	var start = document.getElementById('new-event-start').value;
	var end = document.getElementById('new-event-end').value;
	var notes = document.getElementById('new-event-notes').value;

	if(document.getElementById('new-event-type-r1').checked) {
		type = document.getElementById('new-event-type-r1').value;
	} else if(document.getElementById('new-event-type-r2').checked) {
		type = document.getElementById('new-event-type-r2').value;
	} else if(document.getElementById('new-event-type-r3').checked) {
		type = document.getElementById('new-event-type-r3').value;
	}
	var id = month[selectedDay.week][selectedDay.day].events.length;
	var newEvent = new Event(id, name, type, start, end, notes);
	month[selectedDay.week][selectedDay.day].events.push(newEvent);

	resetNewEventModalInput();
	modalCloseClick(document.getElementById('modal_close'));
	renderEventListDOM(month[selectedDay.week][selectedDay.day]);

}


var resetNewEventModalInput = function() {
	document.getElementById('new-event-name').value = "";
	document.getElementById('new-event-start').value = "";
	document.getElementById('new-event-end').value = "";
	document.getElementById('new-event-notes').value = "";
	document.getElementById('new-event-type-r1').checked = true;
	document.getElementById('new-event-type-r2').checked = false;
	document.getElementById('new-event-type-r3').checked = false;
}

var resetDOM = function() {
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