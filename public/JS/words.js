var currentWords = [];
$(document).ready(function(){
	//words displays the user words
	words();
	//function to make text area auto resize
	$('textarea').each(function(){
		this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
	}).on('input', function(){
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
	});
	//function to save definitions
	$(".word-input-definition-submit").click(function(){
		var id = this.id;
		var valueId = id+"_";
		var value = $("#"+valueId).val();
		var word = id.replace(/ID/, '').toLowerCase();
		$.ajax({
			url: '/saveDefinition',
			data: {word: word, def:value},
			type: 'POST',
			async: false,
			success: function (data){
				if (data.success == false){console.log("ERROR OCCURED:", data.data)}
				else console.log("DEFINITION SAVED:", data);
			},
			error: function (xhr, status, error){
			console.log("ERROR FROM SERVER:", error);
			}
		})
	});
});
function words(){
	$.ajax({
		url: "/words",
		type: "POST",
		async: false,
		success: function(data){
			// console.log(data);
			if (data.error){
				console.log("%cERROR RECEIVED","color: red; font-weight: bold;");
				$(".words").html("<p>"+data.data+"</p>");}
			else {
				console.log("%cYES", "color: green; font-weight: bold;");
				// console.log(data);
				var append = "";
				append += makeQuizBar();
				append += displayWords(filterDuplicates(data.data));
				append += makeWordGuides();
				currentWords = filterDuplicates(data.data);
				$(".words").html(append);
			}
		},
		error: function (xhr, status, error){
			console.log("ERROR FROM SERVER");
			$(".words").html("<h3>ERROR</h3>An error occurred from our server. DETAILS BELOW:<br><b>"+error+"</b>");
		}
	});
}
test = ["cry", "yell", "cry", "scream", "cry", "scream"]
function makeQuizBar(){
	var append = "";
	append += "<div class='container-fluid'>"
	append += "<div class ='quiz-box col-md-8 col-xs-10 col-lg-6'>";
	append += "<div class='col-md-4 col-xs-4 col-lg-4'>My words</div><div id='quiz-prompt' class='col-md-6 col-xs-6 col-lg-6 col-md-offset-1 col-xs-offset-1 col-lg-offset-1'>Quiz myself</div>"
	append += "</div>";
	append += "</div>";
	return append;
}
function displayWords(array){
	/*return an HTML ready list of words in the array*/
	var append = "", listLength = array.length;
	var input = "";
	append += "<div class='container-fluid'>"
	append += "<div class ='words-box col-md-8 col-xs-10 col-lg-6'>";
	//
	if (array[0]== "You have not saved any word yet.") {append += "<span class='word'>"+array[0]+"</span><br>";}
	else for (var x = 0; x < listLength; x++){
		input = "<input type='submit' value='save definition' class='word-input-definition-submit' id='"+array[x]+"ID' ><textarea type='text' class='word-input-definition' id='"+array[x]+"ID_'></textarea>";
		// if (x == listLength - 1) append += "<span class='word last'>"+array[x]+"</span>"+input+"<br>";
		append += "<span class='word'>"+array[x]+"</span>"+input+"<br>";
	}
	//
	append += "</div>";
	append += "</div>";
	return append;
}
function filterDuplicates(array){
	var result = [];
	for (var x = 0; x < array.length; x++){
		if (result.indexOf(array[x]) == -1){
			result.push(array[x]);
		}
	}
	return result;
}
function makeWordGuides() {
	var append = "";
	append += "<div class='container-fluid'>"
	append += "<div class ='words-guides col-md-8 col-xs-10 col-lg-6'>";
	append += "You can add your own definition, or click on the word for the dictionary definition.";
	append += "</div>";
	return append;
}


