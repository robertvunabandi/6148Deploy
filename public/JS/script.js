var addWordLeft;
var currentOxford;
$(document).ready(function(){
	console.log('%cReady','background-color: black; color: white; font-weight: bold;');
	/*This positions the add-word to be on the right place*/
	addWordReposition(); $(window).resize(function(){addWordReposition();});
	/*This displays that message in case someone doesn't input a required field*/
	jQuery("form input").on("invalid", function(event) {
    	this.setCustomValidity('This is required');
	});

	/*This is what happens when users enters a word*/
	$(".search-word-input").on("invalid", function(){
		this.setCustomValidity("Please, use only letters in the alphabet. No numbers nor characters are allowed. Thank you.");
	});
	$(".search-word-input").on("change", function(){
		$(".result-word").css("display", "none");
		setTimeout(function(){
			//get the word user inputed
			$(".result-word").css("opacity", "0");
			$(".result-word").css("display", "block");
			var word = $(".search-word-input").val(); 
			//the the word from value, this also changes content of .result-word
			searchQuery(word);
			//display the result, We can play with animations
			$(".result-word").fadeTo("slow", 0.3, function(){
					$(".result-word").css("opacity", "1");
				});
			}, 10);
		setTimeout(function(){
			//reposition the .add-word
			addWordReposition();
		}, 20);
		setTimeout(function(){
			addword();
		}, 30);
		setTimeout(function(){
			$("#result-word-fetch").click(function(){
				$("#result-word-fetch").css("display", "none");
			});
		}, 40);
	});
	/*Add word to a user's list*/
	// $(".add-word").click(function(){console.log("YES")})
});

function addword(){
	$(".add-word").click(function(){
		var word = $("#result-word-value").html();
		$.ajax({
			url: "/add-word",
			type: "POST",
			data: {word: word},
			async: false,
			success: function(data){
				//success:true means we retrieved the word from dict.
				$("#result-word-fetch").css("opacity", "0");
				$("#result-word-fetch").css("display", "block");
				$("#result-word-fetch").html(data.message);
				$("#result-word-fetch").fadeTo(100, 0.5, function(){
					$("#result-word-fetch").css("opacity", "1");
				});
				resultWordFetchReposition();
				// console.log(data.message);
			},
			error: function (xhr, status, error){
				console.log("ERROR:", error)
			},
		});
	});
}
function resultWordFetchReposition(){
	var change = 0;
	var objWidth = $(".result-word").width() - change;
	var objOffset = $(".result-word").offset().left + (change/2);
	var objHeight = $(".result-word").height();
	var previousHeight = $("#result-word-fetch").height();
	var objChildHeight = (objHeight - previousHeight)/2;
	// console.log("Fixed width", change, objWidth, objOffset);
	$("#result-word-fetch").css("left", objOffset);
	$("#result-word-fetch").css("width", objWidth);
	$("#result-word-fetch").css("height", objHeight);
	// document.getElementById("result-word-fetch").firstChild.style.top = objChildHeight+"px";
	// setTimeout(function(){$("#result-word-fetch:first-child").css("top", objChildHeight);}, 100);
	
}

function addWordReposition(){
	/*This positions the add-word to be on the right place*/
	var addWordWidth = Math.round(parseInt($(".add-word").css("padding-left")) + parseInt($(".add-word").css("padding-right")) + parseInt($(".add-word").width()));
	var resultWidth = $(".result-word").offset().left + $(".result-word").width();
	// console.log(resultWidth, addWordWidth);
	addWordLeft = resultWidth - addWordWidth;
	// console.log(addWordLeft);
	$(".add-word").css("left", addWordLeft);
}

function searchQuery(val){
	if (val == null || val == ""){
		$(".result-word").html("");
	} else if (val.search(/[^a-zA-Z]+/) !== -1) {
		var errorMessage = "Please, use only letters in the alphabet. No numbers nor characters are allowed. Thank you.";
		$(".result-word").html(errorMessage);
	} else {
		$(".result-word").html(displayWord(val));
		$.ajax({
			url: "/search-word",
			data: {word: val},
			type: "GET",
			async: false,
			success: function (dataReceived){
				// displayWord(dataReceived);
				currentOxford = dataReceived;
				console.log(dataReceived);
			},
			error: function (xhr, status, error){
				$(".result-word").html("<h3>ERROR</h3>An error occurred from our server. <br><b>"+error+"</b>");
			}
		});
	}
}

function displayWord(word){
	/*
	word is a json file.
	(ideally, we want more, like type, examples of usage, etc, but this is good).
	This is the function that will display the word that it received from the database. 
	Assume the word is received, this is how the format will form it.
	*/
	// var svg = '<img src="./images/add.svg" class="add-word-svg" alt="add this word">';
	var svg = '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 21.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" class="add-word-svg" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><g><path d="M25,2c12.7,0,23,10.3,23,23S37.7,48,25,48S2,37.7,2,25S12.3,2,25,2 M25,0C11.2,0,0,11.2,0,25s11.2,25,25,25s25-11.2,25-25S38.8,0,25,0L25,0z"/></g><line class="st0" x1="25" y1="5" x2="25" y2="45"/><line class="st0" x1="5" y1="25" x2="45" y2="25"/></svg>';
	var name = word, append = "<span class='add-word'>"+svg+"</span>";
	append += "<div id='result-word-fetch' style='display:none;'>"+name+"</div>";
	append += "<h3 id='result-word-value'>"+name+"</h3>";
	return append;
}
