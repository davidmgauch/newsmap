//web scrape full news text
var cheerio = require('cheerio');
var request = require('request');

request({
    method: 'GET',
    url: 'https://bigstory.ap.org/article/96b060aa9b6d439692ebbd37205f127c/thousands-urged-flee-ahead-flooding-california-rivers'
}, function(err, response, body) {
    if (err) return console.error(err);

    // Tell Cherrio to load the HTML
    var $ = cheerio.load(body);


   	var articleTitle = $('div.field-item').children().text();


   	console.log(articleTitle);
   	//testModal
   	// $( "div#testModal" ).append( "<p class='testModalText'>" + articleTitle + "</p>" );
});