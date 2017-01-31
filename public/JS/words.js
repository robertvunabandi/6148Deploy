var currentWords = [];
var shadeAll = "<div class='shade-all' style='display:none'></div>";
var plainTextDownload = "";
var fXid; var fXword; var fXtextAreaID; var fXindex; var fXnextDef;
$(document).ready(function(){
	//words displays the user words
	words();
	addPlus = true;
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
				if (data.success == false){console.log("ERROR OCCURED:", data.data);}
				else console.log("DEFINITION SAVED. RESPONSE:", data);
			},
			error: function (xhr, status, error){
			console.log("ERROR FROM SERVER:", error);
			}
		});
	});
	//Delete a word
	$(".word-input-definition-delete").click(function(){
		var id = this.id;
		var idChange = id.replace("-","");
		var valueId = idChange+"_";
		var value = $("#"+valueId).val();
		var word = idChange.replace(/ID/, '').toLowerCase();
		var divID = idChange.replace("ID", "") + "_BOX";
		console.log(divID);
		$.ajax({
			url: '/delete-word',
			data: {word: word},
			type: 'POST',
			async: false,
			success: function (data){
				if (data.success == false){console.log("ERROR OCCURED:", data.data);}
				else {
					console.log("WORD DELETED. RESPONSE:", data);
					$("#"+divID).fadeTo("slow",0,function(){
						$("#"+divID).css("display", "none");
					});
				}
			},
			error: function (xhr, status, error){
			console.log("ERROR FROM SERVER:", error);
			}
		});
	});
	// Find the toggles and hide their content
	$('.toggle').each(function(){
		$(this).find('.toggle-content').hide();
	});

	// When a toggle is clicked (activated) show their content
	$('.toggle a.toggle-trigger').click(function(){
		var el = $(this), parent = el.closest('.toggle');

		if( el.hasClass('active') )
		{
			parent.find('.toggle-content').slideToggle();
			el.removeClass('active');
		}
		else
		{
			parent.find('.toggle-content').slideToggle();
			el.addClass('active');
		}
		return false;
	});
	//Displays the words
	$(".word").click(function(){
		var wordID = this.id;
		var parentID = wordID.replace(/\+/, "")+"_BOX";
		var wordTextAreaID = wordID.replace(/\+/, "")+"ID_";
		var wordLKPID = wordID.replace(/\+/, "")+"_LKP";
		var word = wordID.replace(/\+/, "");
		if ($("#"+wordLKPID).is(':visible') == false){
			$.ajax({
				url:"/search-word",
				data: {word: word},
				type: "GET",
				async: false,
				success: function (dataReceived){
					currentOxford = dataReceived;
					var ouput = parseData(dataReceived, true);
					$("#"+wordLKPID).html(ouput);
					$("#"+wordLKPID).slideToggle();
				},
				error: function (xhr, status, error){
					$("#"+wordLKPID).html("ERROR OCCURED");
					$("#"+wordLKPID).slideToggle();
				}
			});
		} else {$("#"+wordLKPID).slideToggle();}
		//ChangeDefinitiononOnClick - - - - - - - - - - -
		$(".addDefSVG").click(function(){ //HASH
			console.log("WOWOW");
			fXid = this.id;
			fXword = fXid.replace(/\_AP[0-9]+/,"");
			fXtextAreaID = fXword+"ID_";
			fXindex = currentWords.indexOf(fXword);
			fXnextDef = $("#"+fXid).parent().next("."+fXid).html();
			console.log(fXnextDef);
			$("#"+fXtextAreaID).html(fXnextDef);
			var id = fXtextAreaID.replace("_","");
			var valueId = id+"_";
			var value = $("#"+valueId).val();
			var word = id.replace(/ID/, '').toLowerCase();
			$.ajax({
				url: '/saveDefinition',
				data: {word: word, def:value},
				type: 'POST',
				async: false,
				success: function (data){
					if (data.success == false){console.log("ERROR OCCURED:", data.data);}
					else console.log("DEFINITION SAVED. RESPONSE:", data);
				},
				error: function (xhr, status, error){
				console.log("ERROR FROM SERVER:", error);
				}
			})
		});
	});
	//function to put text on quizlet export
	$("#quizlet-export").click(function(){
		$("#quizlet-import-modal").css("display", "block");
		$(".shade-all").fadeTo("fast",1, function(){
			$(".shade-all").css("display", "block");
		});
		quizletImportText();
		$('textarea').each(function(){
			this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
		}).on('input', function(){
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		});
	});
	//function to download as PDF
	$("#pdf-import").click(function(){
		doc.setTextColor(0, 0, 0);
		doc.setFont("Amiri", "regular");
		var lineHeight = 0.25;
		var initialHeight = 1;
		var charMax = 72;
		var title = "MY WORDS";
		doc.text(title, 1, initialHeight);
		initialHeight = initialHeight + (2*lineHeight);
		for (x in currentWords){
			var text = "";
			var available = charMax - (currentWords[x].length + 2);
			if (currentDefinitions[x] != null){
				var charExtra = currentDefinitions[x].length - available;
				var string;
				if (charExtra > 0){
					console.log(currentDefinitions[x]);
					string = currentDefinitions[x].substring(0, available);
					text += currentWords[x] + " : " + string;
					doc.text(text, 1, initialHeight);
					string = currentDefinitions[x].substring(available, currentDefinitions[x].length);
					while (charExtra > 0){
						initialHeight = initialHeight + lineHeight;
						if (string.length >= charMax-3) {
							charExtra = charExtra - (charMax-3);
							text = string.substring(0, charMax-3);
							string = string.substring(charMax-3, string.length);
						}
						else {
							charExtra = charExtra - string.length;
							text = string;
							string = string.substring(string.length-1, string.length);
						}
						doc.text(text, 1.25, initialHeight);
						if (charExtra < 0) break;
					}
				}
				else {
					text += currentWords[x] + " : " + currentDefinitions[x];
					doc.text(text, 1, initialHeight);
				}
			}
			else {
				text += currentWords[x] + " : " + currentDefinitions[x];
				doc.text(text, 1, initialHeight);
			}
			initialHeight = initialHeight + lineHeight;
		}
		var madeWithLexis = "Generated with Lexis";
		doc.text(madeWithLexis, 6.1, 0.5);
		doc.save('myWords.pdf');
	});
	//remove any modal
	$(".shade-all").click(function(){
		$("#quizlet-import-modal").fadeTo("fast",1, function(){
			$("#quizlet-import-modal").css("display", "none");
		});
		$(".shade-all").fadeTo("fast",1, function(){
			$(".shade-all").css("display", "none");
		});
		// $(".shade-all").css("display", "none");
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
				if (data.error == false){
					append += makeQuizBar();
					append += displayWords((data.data), data.definitions);
					currentWords = (data.data);
					currentDefinitions = (data.definitions);
					append += makeWordGuides();
					$(".words").html(append);
				} else {
					addPlus = true;
					append += makeQuizBar();
					append += displayWords((data.data), data.definitions);
					currentWords = (data.data);
					currentDefinitions = (data.definitions);
					append += makeWordGuides();
					var newline = "\n";
					plainTextDownload += "My Words " + newline + newline;
					for (x in currentWords){
						plainTextDownload += currentWords[x] + ": " + currentDefinitions[x]+ ";" + newline;
					}
					plainTextDownload += newline + newline + newline + "Generated with LEXIS | All Rights Reserved";
					$(".words").html(append);
				}
			}
		},
		error: function (xhr, status, error){
			console.log("ERROR FROM SERVER");
			$(".words").html("<h3>ERROR</h3>An error occurred from our server. DETAILS BELOW:<br><b>"+error+"</b>");
		}
	});
}

function quizletImportText(){
	$.ajax({
		url: "/words",
		type: "POST",
		async: false,
		success: function(data){
			// console.log(data);
			if (data.error){
				console.log("%cERROR RECEIVED","color: red; font-weight: bold;");
				$(".quizlet-text-to-copy").html("<p>"+data.data+"</p>");}
			else {
				console.log("%cYES IMPORT", "color: green; font-weight: bold;");
				var append = "";
				currentWords = filterDuplicates(data.data);
				currentDefinitions = filterDuplicates(data.definitions);
				for (x in currentWords){
					append += currentWords[x]+","+currentDefinitions[x]+"\n";
				}
				$("#quizlet-text-to-copy").html(append);
			}
		},
		error: function (xhr, status, error){
			console.log("ERROR FROM SERVER");
			$(".words").html("<h3>ERROR</h3>An error occurred from our server. DETAILS BELOW:<br><b>"+error+"</b>");
		}
	});
}
function makeQuizBar(){
	var append = "";
	append += makeQuizletModal();
	append += "<div class='container-fluid'>"
	append += "<div class ='quiz-box col-md-8 col-xs-10 col-lg-6'>";
	// append += "<div class='col-md-4 col-xs-4 col-lg-4'>My words</div>";
	var svgExport = '<svg class="svgED" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>';
	var svgDownload = '<svg class="svgED" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
	var exportOptions = "<div class='col-md-6 col-xs-6 col-lg-6 upload-option' ><div id='quizlet-export' class='col-md-12 col-xs-12 col-lg-12 export'>Quizlet"+svgExport+"</div></div><div class='col-md-6 col-xs-6 col-lg-6 col-md-offset-3 col-xs-offset-3 col-lg-offset-3 upload-option' ><div id='pdf-import' class='col-md-12 col-xs-12 col-lg-12 export'>PDF"+svgDownload+"</div></div>";
	append += "<div style='background-color:white; padding: 0.5rem 0rem;' class='col-md-12 col-xs-12 col-lg-12 '><div class='myword-title'>My Words</div>"+exportOptions+"</div>";

	append += "</div>";
	append += "</div>";
	return append;
}
function makeQuizletModal(){
	var append = "";
	append += "<div id='quizlet-import-modal' class='bounceInUp animated' style='display: none;'>";
	append += "<div id='quizlet-instructions'><h3>Export to Quizlet</h3><span class='quizlet-emphasize'>Log in</span> to your <a href='https://quizlet.com/'>Quizlet account</a>.<br>Click on <a href='https://quizlet.com/create-set'>create</a> to <span class='quizlet-emphasize'>create a new set</span>.<br>Click on <span class='quizlet-emphasize'>import</span>.<br>Then <span class='quizlet-emphasize'>copy and paste</span> the text below.<br>Finally, make sure you <span class='quizlet-emphasize'>selected 'comma'</span> as a word/definition separator.</div>";
	append += "<div id='words-copy'><textarea id='quizlet-text-to-copy'></textarea></div>";
	append += "<div id='quizlet-instructions'><em>Click anywhere outside of this box to clear it.</em></div>";
	append += "</div>";
	return append;
};
function displayWords(array, definitions){
	/*return an HTML ready list of words in the array*/
	var append = "", listLength = array.length;
	var input = "";
	append += "<div class='container-fluid'>"
	append += "<div class ='words-box col-md-8 col-xs-10 col-lg-6'>";
	var del = "";
	//
	if (array[0]== "You have not saved any word yet.") {append += "<span class='word'>"+array[0]+"</span><br>";}
	else for (var x = 0; x < listLength; x++){
		append += "<div class='container-fluid' id='"+array[x]+"_BOX'>";
		del = "<input type='submit' value='delete' class='word-input-definition-delete' id='"+array[x]+"ID-' >";
		if (definitions[x] == null) input = "<span class='save-delete'><input type='submit' value='save' class='word-input-definition-submit' id='"+array[x]+"ID' >"+del+"</span><textarea type='text' class='word-input-definition' id='"+array[x]+"ID_'></textarea>";
		else input = "<div class='save-delete'><input type='submit' value='save' class='word-input-definition-submit' id='"+array[x]+"ID' >"+del+"</div><textarea type='text' class='word-input-definition' id='"+array[x]+"ID_'>"+definitions[x]+"</textarea>";
		
		// if (x == listLength - 1) append += "<span class='word last'>"+array[x]+"</span>"+input+"<br>";
		append += "<span class='word' id='"+array[x]+"+'>"+array[x]+"</span>"+input+"<br>";
		append += "</div>";
		append += "<div class='container-fluid word-BOX-LKP' id='"+array[x]+"_LKP' style='display:none;'></div>";
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
	append += "You can modify a word's definition by clicking on the given definition and editing it or clicking on the word itself to choose from a set of dictionary definitions.";
	append += "</div>";
	return append;
}

