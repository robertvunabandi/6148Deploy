var addWordLeft;
$(document).ready(function(){
	console.log('Ready');
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
	});

	/*Add word to a user's list*/
	$(".add-word").click(function(){
		if (logged){
			$.ajax({
				url: "/add-word",
				type: "POST",
				async: false,
				success: function(){},
				error: function (xhr, status, error){},
			});
		} else {
			//Open a page to sign in or log in.
			//Case login: Open a pop up box, and link that to a modal box to log in
			//Case sign-up: Open a pop up box, and link that to the a sign up page. Make to save word behind.
		}
	});
	
});

function addWordReposition(){
	/*This positions the add-word to be on the right place*/
	var addWordWidth = Math.round(parseInt($(".add-word").css("padding-left")) + parseInt($(".add-word").css("padding-right")) + parseInt($(".add-word").width()));
	var resultWidth = $(".result-word").offset().left + $(".result-word").width();
	console.log(resultWidth, addWordWidth);
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
		// console.log("Value is ("+val+")");
		var test = {name: "Cry", definition:["shed tears, especially as an expression of distress or pain","shout or scream, especially to express one's fear, pain, or grief","(of a bird or other animal) make a loud characteristic call"]};
		displayWord(test);
		/*$.ajax({
			url: "/search-word",
			type: "GET",
			async: false,
			success: function (dataReceived){
				displayWord(dataReceived);
			},
			error: function (xhr, status, error){
				$(".result-word").html("<h3>ERROR</h3>An error occurred from our server. <br><b>"+error+"</b>");
			}
		});*/
	}
}

function displayWord(word){
	/*
	Let's assume that word is a json file with keys: name, definition 
	(ideally, we want more, like type, examples of usage, etc, but this is good).
	This is the function that will display the word that it received from the database. 
	Assume the word is received, this is how the format will form it.
	*/
	var name = word.name, def = word.definition, append = "<span class='add-word'>+</span>";
	append += "<h3>"+name+"</h3>";
	for (x in def){append += "<p>"+def[x]+"</p>";}
	$(".result-word").html(append);
}
