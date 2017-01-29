$(document).ready(function(){
	/*Generates the input for date, month, and year*/
	genBDay();
});


function genBDay(){
	var append = "";
	var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	//Month
	append += "<select name='birth_month' tabindex='1' class='col-xs-5 col-md-5 userBirthday_Input' id='birth_month' required>";
	append += "<option value=''>Birth month</option>";
	for (var i = 0; i < months.length; i++){
		append += "<option value"+(i+1)+">"+months[i]+"</option>";
	}
	append += "</select>";
	//Day
	append += "<select name='birth_day' tabindex='2' class='col-xs-3 col-md-3 userBirthday_Input' id='birth_day' required>";
	append += "<option value=''>Day</option>";
	for (var i = 1; i < 32; i++){
		append += "<option value"+(i)+">"+i+"</option>";
	}
	append += "</select>";
	//Year
	append += "<select name='birth_year' tabindex='3' class='col-xs-4 col-md-4 userBirthday_Input' id='birth_year' required>";
	append += "<option value=''>Year</option>";
	for (var i = 2017; i > 1890; i--){
		append += "<option>"+i+"</option>";
	}
	append += "</select>";
	$("#userBirthday").html(append);
}


