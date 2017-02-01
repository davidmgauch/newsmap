// var cheerio = require('cheerio');
// var request = require('request');

// request({
//     method: 'GET',
//     url: 'https://bigstory.ap.org/article/96b060aa9b6d439692ebbd37205f127c/thousands-urged-flee-ahead-flooding-california-rivers'
// }, function(err, response, body) {
//     if (err) return console.error(err);

//     // Tell Cherrio to load the HTML
//     var $ = cheerio.load(body);


//      var articleTitle = $('div.field-item').children().text();


//      console.log(articleTitle);
//      //testModal
//      $( "div#testModal" ).append( "<p class='testModalText'>" + articleTitle + "</p>" );
// });



$(document).ready(function(){
  

//DRAGABILLY
// var $draggable = $('#scrollContainer').draggabilly({
//   axis: 'y'
//   // containment: '.container'
// })

// function listener(/* parameters */) {
//   // get Draggabilly instance
//   var draggie = $(this).data('draggabilly');
//   console.log( 'eventName happened', draggie.position.x, draggie.position.y );
// }
// // bind event listener
// $draggable.on( 'eventName', listener );
// // unbind event listener
// $draggable.off( 'eventName', listener );
// // bind event listener to trigger once. note ONE not ON
// $draggable.one( 'eventName', function() {
//   console.log('eventName happened just once');
// });

//INTERACT JS
// interact('.dragBox')
//  .draggable({
//  //options

//  });




  //Responsive Screen Sizes
  // window.onload = function() {
  //  function responsiveFn() {
  //       width = $( window ).width();
  //       height = $( window ).height();
          
  //    // Executing Both width() and height()   
  //    document.getElementById('widthID').innerHTML=width; 
  //    document.getElementById('heightID').innerHTML=height; 

  //    // Do a custom code here
  //      if(width <= 480){
  //     document.getElementById('widthID').innerHTML+=" -> This is an Iphone Screen Size"; 
  //    console.log('iPhone Yo')
  //      }
  //   };
  //   $(window).ready(responsiveFn).resize(responsiveFn); 
  // };

    // load() event and resize() event are combined 
     

  setTimeout(function(){
          $('#mapMask').animate({top: '100%'}, 500);

    }, 50);

  setTimeout(function(){
          // $('.container').fadeIn(500);
          $('#mapMask').remove()
          $('.container, .rightContainer').css('display', 'block');
          $('.container, .rightContainer').animate({right: '0'}, 300); 
    }, 600);


  var newsDescription;
  var splitLocation;
  var statesArray = [];
  var saveStates;


  




  //create an object and save all my parameters inside this object
  var place = {}
  
  // $.ajax({
  //     url : 'https://trackchanges.postlight.com/building-awesome-cms-f034344d8ed',
  //     type : 'POST',
  //     contentType : 'application/json',
  //     x-api-key: 'PhXT9xexFWEYUFBsfZ2szDOfVqEw8a7Am8KNZNEV'
  // });



  $.get("https://newsapi.org/v1/articles?source=associated-press&sortBy=latest&apiKey=da20e6d49f9d41d08c4874c315df47b5", function (data, status){
          // console.log(data.articles[0].description);
          console.log(data.articles);

          data.articles.forEach(function(value, i){
            // console.log('value = ' + value);
            newsDescription = value.description;
            splitLocation = newsDescription.split('(AP)')[0];
            var myArticlePosition = getLocationGps(splitLocation, value);
          });
  });


  var getLocationGps = function(splitLocation, value){
    var articleValue = value;
    // console.log(value);
    var urlPlaceName = 'https://maps.googleapis.com/maps/api/geocode/json?address=PLACENAME';

    var parsedUrl = urlPlaceName.replace('PLACENAME', splitLocation);

    // console.log(splitLocation);



    $.get(parsedUrl, function(data, status){   
        // console.log(data);

            var markerLat = data.results[0].geometry.location.lat;
            var markerLng = data.results[0].geometry.location.lng;
            var statesArray = ['Alabama', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'exas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
            var stateName;

        if(typeof data.results[0].address_components[1] !== 'undefined') {
                  var findStateNameOne = data.results[0].address_components[1].long_name;
                  if (statesArray.indexOf(findStateNameOne) > -1) {
                      stateName = findStateNameOne;
                  };
        };
            if(typeof data.results[0].address_components[2] !== 'undefined') {
                var findStateNameTwo = data.results[0].address_components[2].long_name;
                if (statesArray.indexOf(findStateNameTwo) > -1) {
                    stateName = findStateNameTwo;
                };
            };

            if(typeof data.results[0].address_components[3] !== 'undefined') {
                var findStateNameThree = data.results[0].address_components[3].long_name;
                if (statesArray.indexOf(findStateNameThree) > -1) {
                    stateName = findStateNameThree;
                };
            };
            
            var img = articleValue.urlToImage;
            var title = articleValue.title;
            // var author = articleValue.author;
            var url = articleValue.url;
            var description = articleValue.description;
            var splitDescription = description.split('— ')[1];
            var splitDescriptionLocation = description.split('(AP)')[0];
            // console.log(splitDescriptionLocation);
            
            //This checks if Marker and Article are within the bounds of the map
            // var markerLat = markerId._latlng.lat,
            //  markerLng = markerId._latlng.lng,
            var markerBounds = [markerLat, markerLng];

            var southWest = L.latLng(23.778285, -129.352340),
                northEast = L.latLng(49.534462, -55.348439),
                bounds = L.latLngBounds(southWest, northEast);
            
            if (bounds.contains(markerBounds)){
              addMarker(markerLat, markerLng, stateName, img, title, splitDescriptionLocation, splitDescription, url);
            } else {
              //DONT DO THIS
            };
    });
  }

  //Leaflet JS Option
  var addMarker = function(markerLat, markerLng, stateName, image, title, location, description, url){
    // console.log(stateName);

    var uniqueId = Math.random().toString(36).substring(18);

        // console.log(uniqueId);

        // console.log(stateName);
        var stateTrim = stateName.replace(/ /g,'');
        // var res = str.substring(1, 4);
        // var statesubstring = stateTrim.substring(1, 4);
        // console.log(stateTrim);

        var greyIcon = L.icon({
            iconUrl: 'img/leaflet-marker-grey.svg',
            // shadowUrl: 'leaf-shadow.png',
            className: 'allMarkers',
            iconSize:     [25, 41], // size of the icon
            // shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [16, 40], // point of the icon which will correspond to marker's location
            // shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var redIcon = L.icon({
            iconUrl: 'img/leaflet-marker-red.svg',
            // shadowUrl: 'leaf-shadow.png',
            className: 'allMarkers',
            iconSize:     [25, 41], // size of the icon
            // shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [16, 40], // point of the icon which will correspond to marker's location
            // shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var markerId = L.marker( [markerLat, markerLng], {icon: greyIcon} )

        markerGroup.addLayer( markerId );

        var uniqueDiv = ('div.articleContainer#' + uniqueId);

        

        if (image !== null && $(window).width() > 700) {
          var imgContainerClass = "<div class='articleImageContainer'><div class='articleImgCrop'> <img class='articleImage' src='" + image + "';' /></div></div>";
          var articleContainerClass = "<div id='" + uniqueId + "' class='articleContainer'>" + imgContainerClass + "<div class='articleContainerInner'><h1 class='articleTitle'>" + title + "</h1><h1 class='articleAuthor'>" + location + "</h1><p class='articleDescription'>" + description + "</p></div></div>";
          var stateHeader = "<div class='stateContainer'><h1 class='stateText'>" + stateName.toUpperCase() + "</h1> </div>";
          var stateMainContainer = "<div data-id='" + stateTrim + "' id='" + stateTrim + "' class='stateSelector'></div>";

          //IF div id=state already exists add new article to that div.
          if( $('#' + stateTrim).length ) {
            
            $( "div.stateSelector#" + stateTrim ).append( articleContainerClass );

          } else {
            $( "div#scrollContainer" ).append( stateMainContainer );
            $( "div.stateSelector#" + stateTrim ).append( stateHeader );
            $( "div.stateSelector#" + stateTrim ).append( articleContainerClass );

          };  
        } else if (image == null && $(window).width() > 700) {
            articleContainerClass = "<div id='" + uniqueId + "' class='articleContainer'><div class='articleContainerInner'><h1 class='articleTitle'>" + title + "</h1><h1 class='articleAuthor'>" + location + "</h1><p class='articleDescription'>" + description + "</p></div></div>";
            stateHeader = "<div data-id='" + stateTrim + "' class='stateContainer'><h1 class='stateText'>" + stateName.toUpperCase() + "</h1> </div>";
            stateMainContainer = "<div data-id='" + stateTrim + "' id='" + stateTrim + "' class='stateSelector'></div>";
            //IF div id=state already exists add new article to that div.
            if( $('#' + stateTrim).length ) {
              
              $( "div.stateSelector#" + stateTrim ).append( articleContainerClass );

            } else {
              $( "div#scrollContainer" ).append( stateMainContainer );
              $( "div.stateSelector#" + stateTrim ).append( stateHeader );
              $( "div.stateSelector#" + stateTrim ).append( articleContainerClass );
            };
        } else if (image !== null && $(window).width() <= 700) {
            var imgContainerClass = "<div class='articleImageContainer'><div class='articleImgCrop'> <img class='articleImage' src='" + image + "';' /></div></div>";
            var articleContainerClass = "<div id='" + uniqueId + "' class='articleContainer'>" + imgContainerClass + "<div class='articleContainerInner'><h1 class='articleTitle'>" + title + "</h1><h1 class='articleAuthor'>" + location + "</h1><p class='articleDescription'>" + description + "</p></div></div>";
            var stateHeader = "<div class='stateContainer'><h1 class='stateText'>" + stateName.toUpperCase() + "</h1> </div>";
            var stateMainContainer = "<div data-id='" + stateTrim + "' id='" + stateTrim + "' class='stateSelector'></div>";

              markerId.on("click", function (event) {
                markerGroup.eachLayer(function(marker) {
                    marker.setIcon(greyIcon);
                });

                    $('.container').animate({opacity: '0'}, 80, function() { 
                          $('.container').animate({bottom: '-180px'}, 20, function() {
                                $('.stateSelector').remove();
                                $( "div#scrollContainer" ).append( stateMainContainer );
                                $( "div.stateSelector#" + stateTrim ).append( stateHeader );
                                $( "div.stateSelector#" + stateTrim ).append( articleContainerClass );
                                $('.container').animate({opacity: '1'}, 100);
                                $('.container').animate({bottom: '0'}, 'fast'); 
                              
                          });
                    }); 

                    $("div.articleContainer").css({
                              'background-color' : 'rgba(255,255,255,0.7)'
                          });
                    $(uniqueDiv).css({
                              'background-color' : 'rgba(255,255,255,1)'
                        });

                    markerId.setIcon(redIcon);

            });

            $(document).on('click', uniqueDiv, function () {
               window.open(url, '_blank');
            });

        } else if ( image == null && $(window).width() <= 700 ) {
            articleContainerClass = "<div id='" + uniqueId + "' class='articleContainer'><div class='articleContainerInner'><h1 class='articleTitle'>" + title + "</h1><h1 class='articleAuthor'>" + location + "</h1><p class='articleDescription'>" + description + "</p></div></div>";
            stateHeader = "<div data-id='" + stateTrim + "' class='stateContainer'><h1 class='stateText'>" + stateName.toUpperCase() + "</h1> </div>";
            stateMainContainer = "<div data-id='" + stateTrim + "' id='" + stateTrim + "' class='stateSelector'></div>";

              markerId.on("click", function (event) {

                    markerGroup.eachLayer(function(marker) {
                        marker.setIcon(greyIcon);
                    });

                    $('.container').animate({opacity: '0'}, 80, function() { 
                          $('.container').animate({bottom: '-180px'}, 20, function() {
                                $('.stateSelector').remove();
                                $( "div#scrollContainer" ).append( stateMainContainer );
                                $( "div.stateSelector#" + stateTrim ).append( stateHeader );
                                $( "div.stateSelector#" + stateTrim ).append( articleContainerClass );
                                $('.container').animate({opacity: '1'}, 100);
                                $('.container').animate({bottom: '0'}, 'fast'); 
                          });
                    }); 

                    $("div.articleContainer").css({
                              'background-color' : 'rgba(255,255,255,0.7)'
                          });
                    $(uniqueDiv).css({
                              'background-color' : 'rgba(255,255,255,1)'
                        });

                    markerId.setIcon(redIcon);

            });

            $(document).on('click', uniqueDiv, function () {
               window.open(url, '_blank');
            });
        };

      

    
    if ($(window).width() < 700) {
        //Mobile Screen
        // alert('screen < 700');

        $(document).click(function (e) {

          if (!$('.container').is(e.target) && $('.container').has(e.target).length === 0) {
              console.log("Clicked Outside Container");
              // $('.container').css('display', 'none');
              // $('.container').animate({opacity: '0'}, 180);
              $('.container').animate({bottom: '-180px'}, 60, function() {
                    $('.stateSelector').remove();
              });
          };

        });
    } else if ($(window).width() > 700){
        //Desktop Screen
        // alert('Width >>> 1024');

        var element = $("div.articleContainer#" + uniqueId);
        var container = $('div.container');
        var scrollPosition = ( element.offset().top - container.offset().top + container.scrollTop() -180 );

          $(document).on({
              mouseenter: function () {
                  $("div.articleContainer").css({
                    'border-left' : '0px solid white',
                    'background-color' : 'rgba(255,255,255,0.7)'
                  });
                  $(uniqueDiv).css({
                    'border-left' : '10px solid #FF322E',
                    'background-color' : 'rgba(255,255,255,1)'
                  });

                  markerId.setIcon(redIcon);

              },

              mouseleave: function () {
                  $("div.articleContainer").css({
                    'border-left' : '0px solid white',
                    'background-color' : 'rgba(255,255,255,0.7)'
                  });

                  markerId.setIcon(greyIcon);
              }
          }, uniqueDiv);

          $(markerId).mouseenter(function() {
              $("div.articleContainer").css({
                        'border-left' : '0px solid white',
                        'background-color' : 'rgba(255,255,255,0.7)'
                      });
              $(uniqueDiv).css({
                        'border-left' : '10px solid #FF322E',
                        'background-color' : 'rgba(255,255,255,1)'
                      }).fadeIn( 5000);

              //Highlight Marker
              this.setIcon(redIcon);


              //HIGHLIGHT STATE WHEN MARKER IS HOVERED
              // highlightFeature();
              // layer.on({
              //     mouseover: highlightFeature
              // });

              // geojson = L.geoJson(states, {
              //     style: style,
              //     onEachFeature: highlightFeature
              // });

              // function highlightFeature(e) {
              //     var layer = e.target;
              //     console.log(e);
              //     layer.setStyle({
              //         fillColor: '#303030',
              //         dashArray: '',
              //         fillOpacity: 0.7
              //     });

              //     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              //         layer.bringToFront();
              //     }

              //     // info.update(layer.feature.properties);
              // }

              //Scroll to Article
              
              container.animate({
                  scrollTop: scrollPosition
              }, 250);
          }).mouseleave(function() {
            $("div.articleContainer").css({
                  'border-left' : '0px solid white',
                  'background-color' : 'rgba(255,255,255,0.7)'
                });

                this.setIcon(greyIcon);

          });

          markerId.on("click", function (event) {
              window.open(url, '_blank');
          });

          $(document).on('click', uniqueDiv, function () {
              window.open(url, '_blank');
          });
    };

          

          

      //calls the function that will sort my articles and stateheader
      sortStates();

  };


  function sortStates(){
    // console.log('states found ', $('#scrollContainer').find('.stateContainer'));

    var alphabeticallyOrderedDivs = $('#scrollContainer').find('.stateSelector').sort(function(a, b) {
        // console.log($(a).data('id'));
        // console.log($(b).data('id'));
        return String.prototype.localeCompare.call($(a).data('id').toLowerCase(), $(b).data('id').toLowerCase());
    });
    $("#scrollContainer").html(alphabeticallyOrderedDivs);
  };

  map.addLayer(markerGroup);

  // if ($(window).width() < 960) {
  //    alert('Less than 960');
  // };
  //ENDED HERE, trying to get Return button to only show if zoomed
  // map.on('zoomend', function () {
  // if (map.getZoom() > 4) {
  //     $('button')
  // }
  // if (map.getZoom() < 5)
  // {
  //     map.addLayer(heatmapLayer);
  // }  
  // //Return Map Function
  // $('button').on('click', function () {
  //     map.setZoom(4);
  //     // window.open('https://google.com/', '_blank');
  // });
  if ($(window).width() <= 700) {
      //Mobile Screen
      $('#map-button').on('click', function () {
          map.fitBounds(boundStates.getBounds());
      });
  } else if ($(window).width() > 700){
    //Desktop Screen
    $('#map-button').on('click', function () {
        map.fitBounds(boundStates.getBounds());
    });
  };

  


});



