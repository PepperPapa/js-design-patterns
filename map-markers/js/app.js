var map;
var service;
var infowindow;

function initMap() {
  var myHome = new google.maps.LatLng(28.2497179, 113.0958297);
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: myHome,
    disableDefaultUI: true,
    scaleControl: true
  });
  
  infowindow = new google.maps.InfoWindow();
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      showSearchList(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name + '...');
    
    // load wikipedia data
    var wikiURL = "https://zh.wikipedia.org/w/api.php?" +
        "action=opensearch&format=json&formatversion=2&search=" +
        place.name + "&namespace=0&limit=10&suggest=true";
    var  wikiRequestTimeout = setTimeout(function() {
      console.log("wikipedia have no response.");
    }, 8000);
    
    $.ajax({
      url: wikiURL,
      dataType: "jsonp",
      // jsonp: "callback",
      success: function (response) {
        // console.log(response[2].toString());
        if (response[2].toString().length > 0) {
          infowindow.setContent(response[2].toString());
        }
        clearTimeout(wikiRequestTimeout);
      }
    });
    
    infowindow.open(map, this);
  });
}

var $search_list = document.getElementById('search-list');
function showSearchList(place) {
  var liElement = document.createElement('li');
  liElement.className = "place-item";
  liElement.innerHTML = "<div class='li-name'>" + place.name + "</div>" +
            "<div class='li-addr'>" + place.formatted_address + "</div>" +
                "<img class='li-img' src=" + place.icon + ">"  + "</img>";
  $search_list.appendChild(liElement);
}

var $search_bar = document.getElementById('search-bar');
var $search = document.getElementById('search-input');
$search.addEventListener('keypress', function(e) {
  if (e.keyCode == 13) {
    var request = {
      location: {lat: 28.2497179, lng: 113.0958297},
      radius: '500',
      query: $search.value
    };
    
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback); 
    // clear search list
    $search_list.innerHTML = "";
    $search_list.className = "show";
    $search_bar.className = "bg-blue";
  }
});


// 
// var model = {
//   init: function () {
//     var self = this;
//     this.map = new google.maps.Map(document.getElementById('map'), {
//       zoom: 8,
//       center: new google.maps.LatLng(28.2497179, 113.0958297),
//       disableDefaultUI: true,
//       scaleControl: true
//     });
//     // this.placeService = new google.maps.places.PlacesService(self.map);
//   }
// };
// 
// var octopus = {
//   init: function() {
//     model.init();
//     view.init();
//     // var placeService = new google.maps.places.PlacesService(model.map);
//   }
// };
// 
// var view = {
//   init: function() {
//     var self = this;
//     this.search_bar = document.getElementById('search-bar');
//     this.search_list_ul = document.getElementById('search-list');
//     this.search_input = document.getElementById('search-input');
//     this.search_input.addEventListener('keypress', function(e) {
//       if (e.keyCode == 13) {
//         var request = {
//           location: {lat: 28.2497179, lng: 113.0958297},
//           radius: '500',
//           query: self.search_input.value
//         };
//         
//         // clear search list first
//         self.search_list_ul.innerHTML = "";
//         
//         self.search_list_ul.className = "show";
//         self.search_bar.className = "bg-blue";
//       }
//     });
//   },
//   
// };
// 
// octopus.init();































