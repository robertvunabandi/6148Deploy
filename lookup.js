var app_id = '52c86221';
var app_key = '5b10a7864c852347235ef808c96a2413';
var language = 'en';
var word_id = 'run'; // user input, should be URL encoded
var url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/' + language + '/' + word_id.toLowerCase();

var request = require('request');

var options = {
  url: url,
  method: 'GET',
  headers: {
    'app_id': app_id,
    'app_key': app_key
  }
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var jsonDump = JSON.parse(body);
    // console.log(body) <= string dump

    // Only gives first definition
    var def1 = jsonDump.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
    // console.log(def1);
  } else if (error) {
    console.log(error);
  }
}

request(options, callback);


/*
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.setRequestHeader('app_id', app_id);
xhr.setRequestHeader('app_key', app_key);

xhr.send();
// xhr.addEventListener("readystatechange", processRequest, false);

xhr.onreadystatechange = processRequest;

function processRequest(e) {
  if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      console.log("test2");
      console.log(response);
  }
  else {
    // alert("Problem retrieving dictionary definition");
  }
}
*/


/*
function printJSON() {

}
httpRequest.onreadystatechange = printJSON;
*/

/*
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}
*/
