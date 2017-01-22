var modal = false;
$(document).ready(function(){
	console.log("navbar ready.");
	$("#nav-log-in").click(function(){
		loginModal();
	});
	$(".login-click").click(function(){
		loginModal();
	});
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

function loginModal(){
	$(".login-modal").css("display", "block");
	$('.login-modal').fadeOut(200, function(){
		$('.login-modal').css('background', "rgba(0,0,0,0.4)").fadeIn(200);
	});
	// $(".login-modal").css("background-color", "rgba(0,0,0,0.4)").fadeIn(2000);
	modal = true;
	if (modal){
		$(".login-modal-temp").click(function(){removeLoginModal();});
	}
}
function removeLoginModal(){
	$('.login-modal').fadeOut(100, function(){
	    $('.login-modal').css('background', "rgba(0,0,0,0.4)").fadeOut(100);
	});
	setTimeout(function(){
		$(".login-modal").css("display", "none");
	}, 100);
	modal = false;
}

