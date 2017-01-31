var addWordLeft;
var currentOxford;
var currentOxDef = "";
var addPlus = false;
$(document).ready(function(){
	console.log('%cReady','background-color: black; color: white; font-weight: bold;');
	/*This positions the add-word to be on the right place*/
	addWordReposition(); $(window).resize(function(){resultWordFetchReposition();});
	/*This displays that message in case someone doesn't input a required field*/
	jQuery("form input").on("invalid", function(event) {
    	this.setCustomValidity('This is required');
	});

	/*This is what happens when users enters a word*/
	$(".search-word-input").on("invalid", function(){
		this.setCustomValidity("Please, use only letters in the alphabet.");
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
		// setTimeout(function(){ //USELESS NOW, BUT KEEP IT JUST IN CASE
			//reposition the .add-word
			// addWordReposition();
		// }, 20);
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
		var word = $("h3.title").html();
		$.ajax({
			url: "/add-word",
			type: "POST",
			data: {word: word.toLowerCase(), definition:currentOxDef},
			async: false,
			success: function(data){
				//success:true means we retrieved the word from dict.
				$("#result-word-fetch").css("opacity", "0");
				$("#result-word-fetch").css("display", "block");
				$("#result-word-fetch").html(data.message);
				resultWordFetchReposition();
				$("#result-word-fetch").fadeTo(100, 0.5, function(){
					$("#result-word-fetch").css("opacity", "1");
				});
				resultWordFetchReposition();
				// console.log(data.message);
			},
			error: function (xhr, status, error){
				console.log("ERROR:", error);
			},
		});
	});
}
function resultWordFetchReposition(){
	var change = 0;
	var objWidth = $(".result-word").width();
	// var objOffset = $(".result-word").offset().left;
	var objHeight = $(".result-word").height();
	// var previousHeight = $("#result-word-fetch").height();
	// var objChildHeight = (objHeight - previousHeight)/2;
	// console.log("Fixed width", change, objWidth, objOffset);
	// $("#result-word-fetch").css("left", objOffset);
	$("#result-word-fetch").css("width", objWidth);
	$("#result-word-fetch").css("height", objHeight);
	// document.getElementById("result-word-fetch").firstChild.style.top = objChildHeight+"px";
	// setTimeout(function(){$("#result-word-fetch:first-child").css("top", objChildHeight);}, 100);	
}

function addWordReposition(){
	/*This positions the add-word to be on the right place. This is useless now.*/
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
		var errorMessage = "<div style='padding: 1rem; font-size: 2rem; text-align: center;'>Please use only letters in the alphabet.</div>";
		$(".result-word").html(errorMessage);
	} else {
		$.ajax({
			url: "/search-word",
			data: {word: val},
			type: "GET",
			async: false,
			success: function (dataReceived){
				// parseData(dataReceived);
				console.log("DATARECEIVED:", dataReceived);
				if (dataReceived === "ERROR") {
					$(".result-word").html("<div style='padding: 1rem; font-size: 2rem; text-align: center;'>Word not found.</div>");
				} else {
					currentOxford = dataReceived;
					$(".result-word").html(parseData(dataReceived));
				}
			},
			error: function (xhr, status, error){
				$(".result-word").html("<h3>ERROR</h3>An error occurred from our server. <br><b>"+error+"</b>");
			}
		});
	}
}

function parseData(object, removeSVG){
	/*
	word is a json file.
	(ideally, we want more, like type, examples of usage, etc, but this is good).
	This is the function that will display the word that it received from the database. 
	Assume the word is received, this is how the format will form it.
	*/
	var append = ""; //all text appended to this;
	if (removeSVG !== true){
		var svg = '<svg class="add-word-svg" id="Layer_1" height="65" viewBox="0 0 24 24" width="65" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>';
		// var svg = '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 21.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" class="add-word-svg" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><g><path d="M25,2c12.7,0,23,10.3,23,23S37.7,48,25,48S2,37.7,2,25S12.3,2,25,2 M25,0C11.2,0,0,11.2,0,25s11.2,25,25,25s25-11.2,25-25S38.8,0,25,0L25,0z"/></g><line class="st0" x1="25" y1="5" x2="25" y2="45"/><line class="st0" x1="5" y1="25" x2="45" y2="25"/></svg>';
		append += "<span class='add-word'>"+svg+"</span>";
	}
	append += "<div id='result-word-fetch'></div>";
	append += "<div class='word-search-master'>";
	var init = object.results[0];
	var title = init.id;
	var lexicalEntries = init.lexicalEntries;
	var lE = ["entries", "lexicalCategory"]; //these are keywords in each entries
	var ent = ["grammaticalFeatures","senses"];
	var sens = ["definitions", "domains", "examples", "subsenses", "registers"]
	append += "<h3 class='title'>"+title+"</h3>";
	var addDefSVG = "";
	for (x in lexicalEntries){
		var entries = lexicalEntries[x][lE[0]];
		var lexicalCategory = lexicalEntries[x][lE[1]];
		append += "<h4 class='category'>"+lexicalCategory+"</h4>";
		for (y in entries){
			var grammaticalFeatures = entries[y][ent[0]];
			var senses = entries[y][ent[1]];
			for (z in senses){
				var definitions = senses[z][sens[0]];
				var examples = senses[z][sens[2]];
				for (a in definitions){
					var number = parseInt(z)+1;
					if ((x == "0" || x == 0) && (y == "0" || y == 0) && (z == "0" || z == 0) && (a == "0" || a == 0)) {currentOxDef = definitions[a]; fixCurrentOxDef();}
					if (addPlus) addDefSVG = '<svg class="addDefSVG" id="'+title+'_AP'+x+y+z+a+'" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>';
					else addDefSVG = "";
					append += "<p class='definition'><span class='numbered-definition'>"+addDefSVG+number+" </span><span class='"+title+"_AP"+x+y+z+a+"'>"+definitions[a]+"</span></p>";
				}
				append += "<ul>";
				for (a in examples){
					append += "<li class='example'>"+examples[a].text;
					if (append.slice(-1) == "!" || append.slice(-1) == "?") append += "</li>";
					else append += ".</li>";
				}
				append += "</ul>";
				if (z == 5 || z == "5") {break;}
			}
		}
	}
	var google = "<?xml version=\"1.0\" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd' style='width: 30px;'><svg style='width: 30px; height: 30px; position: relative; top: 7px;' enable-background=\"new 0 0 400 400\" height=\"400px\" id=\"Layer_1\" version=\"1.1\" viewBox=\"0 0 400 400\" width=\"400px\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g><path d=\"M142.9,24.2C97.6,39.7,59,73.6,37.5,116.5c-7.5,14.8-12.9,30.5-16.2,46.8c-8.2,40.4-2.5,83.5,16.1,120.3   c12.1,24,29.5,45.4,50.5,62.1c19.9,15.8,43,27.6,67.6,34.1c31,8.3,64,8.1,95.2,1c28.2-6.5,54.9-20,76.2-39.6   c22.5-20.7,38.6-47.9,47.1-77.2c9.3-31.9,10.5-66,4.7-98.8c-58.3,0-116.7,0-175,0c0,24.2,0,48.4,0,72.6c33.8,0,67.6,0,101.4,0   c-3.9,23.2-17.7,44.4-37.2,57.5c-12.3,8.3-26.4,13.6-41,16.2c-14.6,2.5-29.8,2.8-44.4-0.1c-14.9-3-29-9.2-41.4-17.9   c-19.8-13.9-34.9-34.2-42.6-57.1c-7.9-23.3-8-49.2,0-72.4c5.6-16.4,14.8-31.5,27-43.9c15-15.4,34.5-26.4,55.6-30.9   c18-3.8,37-3.1,54.6,2.2c15,4.5,28.8,12.8,40.1,23.6c11.4-11.4,22.8-22.8,34.2-34.2c6-6.1,12.3-12,18.1-18.3   c-17.3-16-37.7-28.9-59.9-37.1C228.2,10.6,183.2,10.3,142.9,24.2z\" fill=\"#FFFFFF\"/><g><path d=\"M142.9,24.2c40.2-13.9,85.3-13.6,125.3,1.1c22.2,8.2,42.5,21,59.9,37.1c-5.8,6.3-12.1,12.2-18.1,18.3    c-11.4,11.4-22.8,22.8-34.2,34.2c-11.3-10.8-25.1-19-40.1-23.6c-17.6-5.3-36.6-6.1-54.6-2.2c-21,4.5-40.5,15.5-55.6,30.9    c-12.2,12.3-21.4,27.5-27,43.9c-20.3-15.8-40.6-31.5-61-47.3C59,73.6,97.6,39.7,142.9,24.2z\" fill=\"#EA4335\"/></g><g><path d=\"M21.4,163.2c3.3-16.2,8.7-32,16.2-46.8c20.3,15.8,40.6,31.5,61,47.3c-8,23.3-8,49.2,0,72.4    c-20.3,15.8-40.6,31.6-60.9,47.3C18.9,246.7,13.2,203.6,21.4,163.2z\" fill=\"#FBBC05\"/></g><g><path d=\"M203.7,165.1c58.3,0,116.7,0,175,0c5.8,32.7,4.5,66.8-4.7,98.8c-8.5,29.3-24.6,56.5-47.1,77.2    c-19.7-15.3-39.4-30.6-59.1-45.9c19.5-13.1,33.3-34.3,37.2-57.5c-33.8,0-67.6,0-101.4,0C203.7,213.5,203.7,189.3,203.7,165.1z\" fill=\"#4285F4\"/></g><g><path d=\"M37.5,283.5c20.3-15.7,40.6-31.5,60.9-47.3c7.8,22.9,22.8,43.2,42.6,57.1c12.4,8.7,26.6,14.9,41.4,17.9    c14.6,3,29.7,2.6,44.4,0.1c14.6-2.6,28.7-7.9,41-16.2c19.7,15.3,39.4,30.6,59.1,45.9c-21.3,19.7-48,33.1-76.2,39.6    c-31.2,7.1-64.2,7.3-95.2-1c-24.6-6.5-47.7-18.2-67.6-34.1C67,328.9,49.6,307.5,37.5,283.5z\" fill=\"#34A853\"/></g></g></svg>";
	append += "<div class='define-on-google'><a href='https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q="+title.toLowerCase()+"+definition' target='_blank'>"+google+" See Google's definition of '"+title+"'</a></div><br>";
	append += "</div><br>";
	return append;
}

function fixCurrentOxDef(){
	if (currentOxDef.slice(-1) == ":"){
		currentOxDef = currentOxDef.substring(0, currentOxDef.length-1);
		return true;
	}
	return false;
}
// BELOW IS FOR MAKING PDFS
// CHECK OUT THE WEBSITE
// http://rawgit.com/MrRio/jsPDF/master/docs/global.html#setFillColor
var doc = new jsPDF({ 
  orientation: 'portrait',
  unit: 'in',
  format: [8.5, 11]
});


