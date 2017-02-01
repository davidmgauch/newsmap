var cheerio = require('cheerio');
var request = require('request');
// var require = require('require');
var express = require('express')
var app = express()



request({
    method: 'GET',
    url: 'https://bigstory.ap.org/article/96b060aa9b6d439692ebbd37205f127c/thousands-urged-flee-ahead-flooding-california-rivers'
}, function(err, response, body) {
    if (err) return console.error(err);

    // Tell Cherrio to load the HTML
    var $ = cheerio.load(body);


   	var articleTitle = $('div.field-item').children().text();


   	// console.log(articleTitle);
});


app.get('/', function (req, res) {
  res.send(articleTitle)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })