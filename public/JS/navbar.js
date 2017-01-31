var modal = false;
var homeSVG = '<svg id="homeSVG" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
$(document).ready(function(){
	console.log("navbar ready.");
	$("#nav-log-in").click(function(){
		// Changed!
	});
	$(".navbar-lexis").html(homeSVG+"<a href=\"/\">Lexis</a>");
	// $(".login-click").click(function(){
		// Changed!
	// });
	$("#nav-sign-up").click(function(){
		// Lead to sign up page
		// NEEDS TO BE FINISHED
	});
	$("#nav-log-out").click(function(){
		// Logs out, leads to home page
		// NEEDS TO BE FINISHED
	});
	$("#nav-profile").click(function(){
		// Leads to profile page, add a drop down menu for preference.
		// NEEDS TO BE FINISHED
	});
});

function crow(){console.log("CROW");}
