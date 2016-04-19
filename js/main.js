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
			if (i === 0) {
				if (j >= firstDayOfMonth) {
					month[i][j] = currentMonthDate;
					currentMonthDate ++;
				} else {
					month[i][j] = previousMonthDate;
					previousMonthDate ++;
				}
			} else {
				if(currentMonthDate <= numberOfDays) {
					month[i][j] = currentMonthDate;
					currentMonthDate++;
				} else {
					month[i][j] = nextMonthDate;
					nextMonthDate ++;
				}
			}
		}
	}
	
	return month;
}


console.log(buildMonthDays());
