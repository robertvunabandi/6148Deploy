var request = require('request');

var app_id = '52c86221';
var app_key = '5b10a7864c852347235ef808c96a2413';
var language = 'en';
// var word_id = 'run'; // user input, should be URL encoded

function lookup(word_id, callback){
  var url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/' + language + '/' + word_id.toLowerCase();
  var options = {
    url: url,
    method: 'GET', // Specify GET request
    headers: { // Authentication headers specific to Oxford's API
      'app_id': app_id,
      'app_key': app_key
    }
  };
  request(options, callback);
}

module.exports = lookup;
